<template>
    <div class="home-container">
        <Header :title="'My Tasks'" :emoji="'🗒️'" :subtitle="'Done is better than perfect. 🌟'">
        </Header>
        <div class="options-container">
            <div class="difficulty">
                <button @click="showingDifficulty = 1" :class="{ active: showingDifficulty === 1 }">Easy</button>
                <button @click="showingDifficulty = 2" :class="{ active: showingDifficulty === 2 }">Medium</button>
                <button @click="showingDifficulty = 3" :class="{ active: showingDifficulty === 3 }">Hard</button>
            </div>

            <button @click="showDueTasks = !showDueTasks" :class="{ active: showDueTasks }">Due Today</button>

        </div>
       <slider v-if="getUser.goals.length > 0" @slide="setCurrentIndex"></slider>
        <div v-if="getUser.goals.length > 0" class="health-section">

            <div class="health-section-container">
                <div class="health-section-container-health"
                    :style="{ width: (getUser.goals[currentIndex].progress / 100) * 100 + '%' }">
                </div>
            </div>
            <h3>{{ getUser.goals[currentIndex].progress }}% Done</h3>
        </div>
        <div v-if="tasks.length > 0">
            <task-card @select="selectTask" @done="completeTask" v-for="task in tasks" :key="task.id"
                :title="task.title" :id="task.id" :showActions="true"></task-card>
        </div>
        <inform-user v-else :title="'No tasks to show'" :emoji="'📭'">
        </inform-user>
        <!-- this popup div could be a component but it isn't used anywhere else -->
        <div class="popup" v-if="selectedTask">
            <h3 v-if="!isEditing" class="title">{{ selectedTask.title }}</h3>
            <input v-if="isEditing" type="text" placeholder="Title..." v-model="editedTitle">
            <h3 v-if="!isEditing" class="title" :innerHTML="selectedTask.description"></h3>
            <Editor v-if="isEditing" v-model="editedDescription" />
            <h3 v-if="!isEditing" class="title">{{ selectedTask.dueDate }}</h3>
            <input v-if="isEditing" type="date" :min="new Date().toISOString().split('T')[0]" max="2030-01-01"
                v-model="editedDueDate">
            <img v-if="!isEditing && selectedTask.difficulty === 1" src="@/assets/easy.svg" alt="easy">
            <img v-if="!isEditing && selectedTask.difficulty === 2" src="@/assets/medium.svg" alt="medium">
            <img v-if="!isEditing && selectedTask.difficulty === 3" src="@/assets/hard.svg" alt="hard">
            <div class="difficulty" v-if="isEditing">
                <div class="difficulty-item" @click="editedDifficulty = 1"
                    :class="{ 'selected': editedDifficulty == 1 }">
                    <img src="@/assets/easy.svg" alt="attack-icon">
                </div>
                <div class="difficulty-item" @click="editedDifficulty = 2"
                    :class="{ 'selected': editedDifficulty == 2 }">
                    <img src="@/assets/medium.svg" alt="quest-center-icon">

                </div>
                <div class="difficulty-item" @click="editedDifficulty = 3"
                    :class="{ 'selected': editedDifficulty == 3 }">
                    <img src="@/assets/hard.svg" alt="my-quest-icon">
                </div>
            </div>
            <button class="edit" @click="editTasks">{{ isEditing ? 'Done' : 'Edit' }}</button>
            <button class="delete" @click="removeTask">Remove</button>
            <button class="reject" @click="selectedId = null">Close</button>
        </div>

    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getFirestore, collection, doc, updateDoc, getDoc } from 'firebase/firestore';
import TaskCard from '@/components/Quest/TaskCard.vue';
import Header from '@/components/Shared/Header.vue';
import Editor from 'primevue/editor';
import InformUser from '@/components/Shared/InformUser.vue';
import Slider from '@/components/Shared/Slider.vue'
export default {
    name: "my-tasks",
    components: {
        TaskCard,
        Editor,
        Header,
        InformUser,
        Slider
    },
    computed: {
        ...mapGetters(['getUser', 'getLoading']),

        tasks() {
            if (this.showDueTasks) {
                return this.notDoneTasksBasedOnDifficulty.filter(task => task.dueDate === new Date().toISOString().split('T')[0])
            } else {
                return this.notDoneTasksBasedOnDifficulty
            }
        },
        notDoneTasksBasedOnDifficulty() {
            return this.getUser.tasks.filter(task => task.goalTitle === this.getUser.goals[this.currentIndex].goalTitle &&
                task.difficulty === this.showingDifficulty &&
                !task.done)
        }
        ,
        selectedTask() {
            if (!this.selectedId)
                return null
            const task = this.tasks.filter(task => task.id === this.selectedId)[0];
            return task
        }
    },
    data() {
        return {
            currentIndex: 0,
            showingDifficulty: 1,
            selectedId: null,
            isEditing: false,
            editedDifficulty: '',
            editedDescription: '',
            editedTitle: '',
            editedDueDate: '',
            showDueTasks: false,
            goals: [
                {
                    title: "Be Athletic",
                    icon: "🏋️‍♂️"
                }, {
                    title: "Develop a skill",
                    icon: "🛠️"
                }, {
                    title: "Income Increase",
                    icon: "💰"
                }
            ],
        }
    },
    methods: {
        navigateTo(to) {
            this.$router.push(to);
        },
        setCurrentIndex(currentIndex) {
            this.currentIndex = currentIndex;
        },
        selectTask(id) {
            this.selectedId = id
        },
        async completeTask(id) {
            try {
                const firestore = getFirestore();
                const usersCollectionRef = collection(firestore, 'users');
                const userDocRef = doc(usersCollectionRef, this.getUser.id);
                const userDocSnapshot = await getDoc(userDocRef);
                const userData = userDocSnapshot.data();
                console.log(userData.goals)
                let selectedTask = null;
                const updatedTasks = userData.tasks.map(task => {
                    if (task.id === id) {
                        task.done = true;
                        selectedTask = task;
                    }
                    return task;
                });

                let updatedGoals = userData.goals.map(goal => {
                    if (goal.goalTitle === selectedTask.goalTitle) {
                        switch (selectedTask.difficulty) {
                            case 1:
                                goal.progress += 10;
                                break;
                            case 2:
                                goal.progress += 20;
                                break;
                            case 3:
                                goal.progress += 30;
                                break;
                        }
                    }
                    if (goal.progress >= 100)
                        alert("🚀YOU FINISHED YOUR GOAL🚀")
                    return goal;
                });
                updatedGoals = updatedGoals.filter(goals => goals.progress < 100)
                await updateDoc(userDocRef, {
                    tasks: updatedTasks,
                    goals: updatedGoals,
                });
                console.log('Goal text updated successfully!');
            } catch (error) {
                console.error('Error updating goal text:', error);
            }
        },
        async removeTask() {
            try {
                const firestore = getFirestore();
                const usersCollectionRef = collection(firestore, 'users');
                const userDocRef = doc(usersCollectionRef, this.getUser.id);
                const userDocSnapshot = await getDoc(userDocRef);
                const userData = userDocSnapshot.data();
                console.log(userData.goals)
                const updatedTasks = userData.tasks.filter(task => task.id != this.selectedTask.id);
                await updateDoc(userDocRef, {
                    tasks: updatedTasks,
                });
                console.log('task deleted successfully!');
            } catch (error) {
                console.error('Error updating goal text:', error);
            }
            this.selectedId = null;
        },
        async editTasks() {
            if (this.isEditing) {
                if (this.editedTitle == '' || this.editedDifficulty == '')
                    return
                try {
                    const firestore = getFirestore();
                    const usersCollectionRef = collection(firestore, 'users');
                    const userDocRef = doc(usersCollectionRef, this.getUser.id);
                    const userDocSnapshot = await getDoc(userDocRef);
                    const userData = userDocSnapshot.data();
                    const updatedTasks = userData.tasks.map(task => {
                        if (task.id === this.selectedTask.id) {
                            task.description = this.editedDescription;
                            task.title = this.editedTitle;
                            task.difficulty = this.editedDifficulty;
                            task.dueDate = this.editedDueDate
                        }
                        return task;
                    });
                    console.log(updatedTasks)
                    await updateDoc(userDocRef, {
                        tasks: updatedTasks,
                    });
                    console.log('task edited successfully!');
                } catch (error) {
                    console.error('Error editing task', error);
                }
                this.selectedId = null;
                this.editedTitle = ''
                this.editedDescription = ''
                this.editedDifficulty = ''
                this.editedDueDate = ''
            }

            this.isEditing = !this.isEditing;
        }
    },
}
</script>
<style lang="scss" scoped>
.home-container {
    width: 100%;
    height: 100%;
    position: relative;
}

button {
    all: unset;
    width: fit-content;
    background-color: #444a5c;
    padding: 10px;
    font-family: 'ptmono';
    margin-bottom: 20px;
}

.active {
    background-color: #162041;
}

.health-section {
    &-container {
        width: 80%;
        height: 30px;
        border: 2px solid #3F8898;
        border-radius: 6px;
        padding: 5px;
        margin: 20px auto;

        &-health {
            height: 100%;
            background-color: #3F8898;
            border: 2px solid #3F8898;
            border-radius: 6px;
        }
    }

    h3 {
        font-family: 'pressstart2p';
        text-align: center;
    }
}

.popup {
    width: 90%;
    top: 50%;
    left: 5%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    row-gap: 15px;
    background-color: #111323;
    border: 1px solid #F5F5F5;
    border-radius: 6px;
    z-index: 2;
    position: absolute;
    padding: 25px;

    & .title {
        font-family: 'ptmono';
        font-size: 32px;
        color: #E5E5E5;
    }

    img {
        width: 120px;
        margin-bottom: 0.5rem;

        @media only screen and (max-width: 767px) {
            width: 80px;
        }
    }

    input {
        width: 100%;
        height: 50px;
        border: 2px solid #17182d;
        color: #E5E5E5;
        background-color: #252a52;
        border-radius: 6px;
        padding-left: 10px;
        font-family: "ptmono";
        font-size: 32px;
        color: #E5E5E5;

        @media only screen and (max-width: 767px) {
            font-size: 18px;
        }
    }

    .edit {
        background-color: #18182E;
        box-shadow: 0px -3px 6px #0000005C;
        border: 1px solid #FFFFFF;
        border-radius: 6px;
        text-align: center;
        margin: 0;
        cursor: pointer;
        color: #f4ee80;

    }

    .delete {
        background-color: #18182E;
        box-shadow: 0px -3px 6px #0000005C;
        border: 1px solid #FFFFFF;
        border-radius: 6px;
        text-align: center;
        margin: 0;
        cursor: pointer;
        color: #a14759;

    }

    .reject {
        background-color: #18182E;
        box-shadow: 0px -3px 6px #0000005C;
        border: 1px solid #FFFFFF;
        border-radius: 6px;
        align-self: flex-end;
        text-align: center;
        margin: 0;
        cursor: pointer;
    }

    ::v-deep(.p-editor-container) {
        background-color: #252a52;
        color: #E5E5E5;
        border-radius: 6px;
    }

    ::v-deep(.ql-toolbar.ql-snow) {
        background-color: #76bbca;
        border: 1px solid #252a52;
        border-radius: 6px;
    }

    ::v-deep(.ql-container.ql-snow) {
        border: 1px solid #252a52;
        border-radius: 6px;
    }

    .editable {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .material-icons {
            font-size: 32px;
        }
    }

    & .difficulty {
        width: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-item {
            padding: 13px;
            cursor: pointer;
        }

        & .selected {
            border: 2px solid #3E8898;
            border-radius: 6px;
        }
    }
}

.options-container {
    width: 100%;
    overflow-x: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;

}
</style>