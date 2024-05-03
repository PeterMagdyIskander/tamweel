<template>
    <div class="home-container">
        <Header :title="'Add a task'" :emoji="'💪'"
            :subtitle="'Rome wasn\'t built in a day 🌟'">
        </Header>
        <div v-if="getUser.goals.length > 0" class="input-container">
            <h3 class="title">Title</h3>
            <input type="text" v-model="title">
        </div>
        <div v-if="getUser.goals.length > 0" class="input-container">
            <h3 class="title">Description</h3>
            <Editor v-model="description" />
        </div>
        <div v-if="getUser.goals.length > 0" class="input-container">
            <h3 class="title">Due Date</h3>
            <input type="date" v-model="dueDate" max="2030-01-01" :min="new Date().toISOString().split('T')[0]">
        </div>
        <div v-if="getUser.goals.length > 0" class="input-container">
            <h3 class="title">Goal Category</h3>
            <slider @slide="setCurrentIndex"></slider>
        </div>

        <div v-if="getUser.goals.length > 0" class="input-container">
            <h3 class="title">Difficulty</h3>

            <div class="difficulty">
                <div class="difficulty-item" @click="difficulty = 1" :class="{ 'selected': difficulty == 1 }">
                    <img src="@/assets/easy.svg" alt="attack-icon">
                </div>
                <div class="difficulty-item" @click="difficulty = 2" :class="{ 'selected': difficulty == 2 }">
                    <img src="@/assets/medium.svg" alt="quest-center-icon">

                </div>
                <div class="difficulty-item" @click="difficulty = 3" :class="{ 'selected': difficulty == 3 }">
                    <img src="@/assets/hard.svg" alt="my-quest-icon">
                </div>
            </div>
        </div>
        <div v-if="getUser.goals.length > 0" class="submit-container">
            <button @click="submit" :disabled="goalText === ''" :class="{ 'disabled': goalText === '' }">SUBMIT</button>
        </div>
    
        <InformUser v-if="getUser.goals.length == 0" :title="'Please add a goal first'" :emoji="'🌟'"></InformUser>
    </div>
</template>

<script>

import { mapGetters } from 'vuex';
import { getFirestore, collection, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import Editor from 'primevue/editor';
import Header from '@/components/Shared/Header.vue';
import InformUser from '@/components/Shared/InformUser.vue';
import Slider from '@/components/Shared/Slider.vue'
export default {
    name: "create-goal",
    computed: mapGetters(['getUser', 'getLoading']),
    components: {
        Editor,
        Header,
        InformUser,
        Slider
    },
    data() {
        return {
            title: "",
            description: "",
            currentIndex: 0,
            difficulty: 0,
            dueDate: '',
        }
    },
    methods: {
        async submit() {
            if (this.title.trim() != '' && this.dueDate.trim() != '' && this.difficulty != 0) {
                const firestore = getFirestore();
                const userCollectionReference = collection(firestore, 'users');// Update the goals array using Firestore's arrayUnion method
                const userDoc = doc(userCollectionReference, this.getUser.id)
                const newTaskId = doc(userCollectionReference).id;
                await updateDoc(userDoc, {
                    tasks: arrayUnion({
                        id: newTaskId,
                        title: this.title,
                        description: this.description,
                        goalTitle: this.getUser.goals[this.currentIndex].goalTitle,
                        difficulty: this.difficulty,
                        dueDate: this.dueDate,
                        done: false,
                    })
                });
                alert("Task added successfully 🚀");
                this.title = "";
                this.description = "";
                this.difficulty = 0;
                this.dueDate = "";
            } else {
                alert("Please fill the form before submitting!");
            }
        },
        setCurrentIndex(currentIndex) {
            this.currentIndex = currentIndex;
        }
    },
}
</script>

<style lang="scss" scoped>
p,
h3 {
    margin: 0;
    padding: 0;
}

.home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 30px;
}

.input-container {
    width: 80%;
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    & .title {
        font-family: 'ptmono';
        font-size: 18px;
        color: #E5E5E5;
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

        @media only screen and (max-width: 767px) {
            font-size: 18px;
        }
    }

    ::v-deep(.p-editor-container) {
        background-color: #252a52;
        color: #E5E5E5;
        border-radius: 6px;
    }
    ::v-deep(.ql-toolbar.ql-snow){
        background-color: #76bbca;
        border: 1px solid #252a52;
        border-radius: 6px;
    }
    ::v-deep(.ql-container.ql-snow){
        border: 1px solid #252a52;
        border-radius: 6px;
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

.submit-container {
    width: 80%;
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
    button {
        width: 170px;
        padding: 10px;
        background-color: #76bbca;
        border-radius: 6px;
        border: 1px solid #E5E5E5;
        color: #fff;
        font-size: 1.2rem;
        font-family: 'pressstart2p';
        cursor: pointer;
    }

    & .disabled {
        background-color: #3E8898;
        color: #eee;
        cursor: unset;
    }
}
</style>
