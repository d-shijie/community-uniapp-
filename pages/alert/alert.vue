<template>
	 <view class="alert" v-if="show">
	    <view class="warn-text">
	      {{ wranText }}
	    </view>
	    <view class="btns">
	      <button @click="confirm" size="mini" round>确认</button>
	      <button @click="cancle" size="mini" round>取消</button>
	    </view>
	  </view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
