<template>
    <div class="slider">
        <button v-if="getUser.goals.length > 1" class="arrow prev" @click="prev"><span
                class="material-icons">keyboard_arrow_left</span></button>

        <div class="slides" :style="{ transform: 'translateX(-' + currentIndex * 100 + '%)' }">
            <div class="slide">
                <span class="icon">{{ getIcon(getUser.goals[currentIndex].goalTitle) }}</span>
                <h3>{{ getTitle(getUser.goals[currentIndex].goalTitle) }}</h3>
            </div>
            <div class="slide">
                <span class="icon">{{ getIcon(getUser.goals[currentIndex].goalTitle) }}</span>
                <h3>{{ getTitle(getUser.goals[currentIndex].goalTitle) }}</h3>
            </div>
            <div class="slide">
                <span class="icon">{{ getIcon(getUser.goals[currentIndex].goalTitle) }}</span>
                <h3>{{ getTitle(getUser.goals[currentIndex].goalTitle) }}</h3>
            </div>
        </div>
        <button v-if="getUser.goals.length > 1" class="arrow next" @click="next"><span
                class="material-icons">keyboard_arrow_right</span></button>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'slider',
    computed: mapGetters(['getUser', 'getLoading']),
    data() {
        return {
            currentIndex: 0,
            totalSlides: 0,
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
    mounted() {
        this.totalSlides = this.getUser.goals.length
    },
    methods: {
        next() {
            this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
            this.$emit('slide', this.currentIndex)
        },
        prev() {
            this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
            this.$emit('slide', this.currentIndex)
        },
        getIcon(goalTitle) {
            return this.goals.filter(goal => goal.title === goalTitle)[0].icon
        },
        getTitle(goalTitle) {
            return this.goals.filter(goal => goal.title === goalTitle)[0].title
        }
    }
}
</script>

<style lang="scss" scoped>
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
</style>