<template>
	<view class="event-list">
		<view @click="gotoEvent($event, item)" class="item" v-for="(item, index) in events" :key="item.id">
			<view @click.stop="showAlert(item.id)" v-if="show" class="delete">
				X
			</view>
			<view class="username">
				{{ item.name }}
			</view>
			<view class="title">{{ item.title }}</view>
			<view class="content">{{ item.content }}</view>
			<view class="img">
				<image :src="item.imgUrl" alt="" />
			</view>
		</view>
		<view>
			<u-modal @cancel="cancle" @confirm="confirm" showCancelButton confirmColor='blue' :show="show2" :title="title" :content='warnText'></u-modal>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			events: {
				type: Array,
				default () {
					return [];
				},
			},
			show: {
				type: Boolean,
				default: false
			}
		},
		components: {

		},
		data() {
			return {
				show2: false,
				warnText: "确认是否删除",
				itemId: null,
			};
		},
		computed: {

		},
		methods: {
			gotoEvent(e, item) {
				this.$store.commit("setProfileInfo", item);
				uni.navigateTo({
					url: '../event/event?id=' + item.id
				})
			},
			showAlert(item) {
				this.show2 = true;
				this.itemId = item;
			},
			cancle() {
				this.show2 = false;
			},
			confirm() {
				let body = {};
				body.id = this.itemId;
				this.$http({url:'/eventDelete',method:'POST',data:body}).then(res=>{
					this.$emit('success')
					this.show2 = false;
				}).catch(err=>{
					console.log(err)
				})
				
			},
		},
	}
</script>

<style>
	.item {
		margin: 0 5px 10px 5px;
		border-radius: 10px;
		background-color: #fff;
		padding: 10px;
		position: relative;
	}

	.delete {
		position: absolute;
		right: 7px;
		top: 2px;
		color: rgb(117, 117, 117);
	}

	.username {
		font-size: 12px;
	}

	.title {
		margin-top: 3px;
		font-size: 14px;
		font-weight: 600;
	}

	.content {
		margin: 3px 0;
		font-size: 12px;
	}

	.img {
		width: 100%;
		height: 100px;
	}

	.img image {
		width: 100%;
		height: 100%;
		border-radius: 10px;
	}
</style>
