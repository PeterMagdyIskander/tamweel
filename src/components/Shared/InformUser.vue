<template>
    <div class="info">
        <h3 class="title">{{ title }} <span class="emojo">{{ emoji }}</span></h3>
    </div>
</template>

<script>
export default {
    name: "inform-user",
    props: {
        title: {
            type: String,
            required: true
        },
        emoji: {
            type: String,
            required: true
        }
    }
}
</script>
<style lang="scss" scoped>
.info {
    width: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 20px;
    background-color: #111323;
    border: 1px solid #F5F5F5;
    border-radius: 6px;
    z-index: 0;
    position: relative;
    margin: 30px auto;

    z-index: 3;
    padding: 10px;
    display: flex;
    flex-direction: column;
    text-align: center;

    & .title {
        font-family: 'ptmono';
        font-size: 18px;
        color: #E5E5E5;
        padding: 20px;
    }

    & .emojo {
        font-size: 32px;
    }

}
</style>