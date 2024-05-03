<template>
    <div class="home-container">
        <Header :title="'Set a goal'" :emoji="'🚀'" :subtitle="'Set goals. Reach. Repeat. 🌟'">
        </Header>

        <inform-user :title="'Let\'s start by setting up a GOAL'" :emoji="'📋'">

        </inform-user>
        <div class="slider">
            <button class="arrow prev" @click="prev"><span class="material-icons">keyboard_arrow_left</span></button>

            <div class="slides" :style="{ transform: 'translateX(-' + currentIndex * 100 + '%)' }">
                <div class="slide">
                    <span class="icon">{{ goals[currentIndex].icon }}</span>
                    <h3>{{ goals[currentIndex].title }}</h3>
                </div>
                <div class="slide">
                    <span class="icon">{{ goals[currentIndex].icon }}</span>
                    <h3>{{ goals[currentIndex].title }}</h3>
                </div>
                <div class="slide">
                    <span class="icon">{{ goals[currentIndex].icon }}</span>
                    <h3>{{ goals[currentIndex].title }}</h3>
                </div>
            </div>
            <button class="arrow next" @click="next"><span class="material-icons">keyboard_arrow_right</span></button>
        </div>
        <div class="button-container">
            <h3 class="title">What do you want to do?</h3>
            <input type="text" v-model="goalText" :placeholder="goalInspos[currentIndex]">
            <button @click="submit" :disabled="goalText === ''" :class="{ 'disabled': goalText === '' }">SUBMIT</button>
        </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex';
import { getFirestore, collection, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import Header from '@/components/Shared/Header.vue';
import InformUser from '@/components/Shared/InformUser.vue';
export default {
    name: "create-goal",
    computed: mapGetters(['getUser', 'getLoading']),
    components: {
        Header,
        InformUser
    },
    data() {
        return {
            currentIndex: 0,
            totalSlides: 3,
            goalText: "",
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
            goalInspos: [
                "Lose 10kg of fat.",
                "Learn programming.",
                "Start a side hustle."
            ]
        }
    },
    methods: {
        next() {
            this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        },
        prev() {
            this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        },
        async submit() {
            if (this.goalText.trim() != '') {
                const firestore = getFirestore();
                const userCollectionReference = collection(firestore, 'users');// Update the goals array using Firestore's arrayUnion method
                const userDoc = doc(userCollectionReference, this.getUser.id)
                await updateDoc(userDoc, {
                    goals: arrayUnion({
                        goalText: this.goalText,
                        goalTitle: this.goals[this.currentIndex].title,
                        progress: 0
                    })
                });
                alert("Goal added successfully 🚀");
                this.goalText = ""
            } else {
                alert("Please add a goal before submitting!");
            }
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
    padding-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 30px;
}


.slider {
    width: 100%;
    text-align: center;
    overflow: hidden;
    position: relative;

    & .slides {
        height: 100%;
        display: flex;
        transition: transform 0.5s ease;

        & .slide {
            min-width: 100%;
            height: 100%;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;

            .icon {
                margin-top: 25px;
                font-size: 100px;
                object-fit: contain;
            }

            h3 {
                font-family: 'pressstart2p';
                color: #f4ee80;
                text-shadow: 1px 2px #a14759;
                font-size: 24px;
                @media only screen and (max-width: 767px) {
                    font-size: 18px;
                }
            }
        }
    }
}

.arrow {
    all: unset;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    padding: 10px;
    z-index: 1;
}

.arrow.prev {
    left: 0;
}

.arrow.next {
    right: 0;
}

/* Style for Google Icon */
.material-icons {
    font-size: 60px;
    @media only screen and (max-width: 767px) {
        font-size: 30px;
    }
}

.button-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 10px;

    & .title {
        font-family: 'ptmono';
        font-size: 18px;
        color: #E5E5E5;
    }

    input {
        width: 80%;
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