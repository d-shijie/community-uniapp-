<template>
	<view>
		<view class="top">
			<view class="tags">
				<button size="mini" @click="getFollowList" :class="{ active: flag === 0 }">关注</button>
				<button size="mini" @click="getFollowedList" :class="{ active: flag === 1 }">粉丝</button>
				<text @click="over" v-if="show" class="over">完成</text>
				<u-icon @click="setting" v-else name="setting"></u-icon>
			</view>
		</view>
		<view class="follow-list">
			<view class="item" v-for="item in list" :key="item.id" @click="gotochat(item.userid, item.followId)">
				<image @click.stop="gotoUserDetail(item.userid, item.followId)" :src="item.headImg"></image>
				<text class="name">{{
		          item.username
		        }}</text>
				<text @click.stop="cancleFollow(item.userId, item.followId)" v-if="show && flag === 0"
					class="cancle">取消关注</text>
			</view>
		</view>
			<u-modal @cancel="cancel" @confirm="confirm" showCancelButton confirmColor='blue' :show="showAlert"  :content='warnText'></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				flag: 0,
				show: false,
				showAlert: false,
				warnText: "是否取消关注",
				body: {},
			}
		},
		onLoad() {
			this.getFollowList()
		},
		methods: {
			getFollowList() {
				let that = this
				uni.getStorage({
					key: 'userId',
					success: function(res) {
						that.$http({
							url: '/followList',
							data: {
								userId: res.data
							}
						}).then(res => {
							that.list = res.data.rows;
							that.flag = 0;
						}).catch(err => {
							console.log(err)
						})
					}
				})
			},
			getFollowedList() {
				let that = this
				uni.getStorage({
					key: 'userId',
					success: function(res) {
						that.$http({
							url: '/followedList',
							data: {
								followId: res.data
							}
						}).then(res => {
							that.list = res.data.rows;
							that.flag = 1;
						}).catch(err => {
							console.log(err)
						})
					}
				})
			},
			gotoUserDetail(userId, followId) {
				//v-for必须要绑定key值且唯一
				if (this.flag === 0) {
					uni.navigateTo({
						url: '../userDetail/userDetail?id=' + followId
					})
				} else if (this.flag === 1) {
					uni.navigateTo({
						url: '../userDetail/userDetail?id=' + userId
					})
				}
			},
			gotochat(userId, followId) {
				if (this.flag === 0) {
					uni.navigateTo({
						url: '../chat/chat?id=' + followId
					})
				} else if (this.flag === 1) {
					uni.navigateTo({
						url: '../chat/chat?id=' + userId
					})
				}
			},
			setting() {
				if (this.flag === 0) {
					this.show = true;
				}
			},
			over() {
				this.show = false;
			},
			cancleFollow(userId, followId) {
				this.showAlert = true;
				this.body.userId = userId;
				this.body.followId = followId;
			},
			cancel(){
				 this.showAlert = false;
				      this.body = {};
			},
			confirm(){
				  this.showAlert = false;
				  this.$http({url:'/deleteFollow',method:'POST',data:this.body}).then(res=>{
					  this.getFollowList()
				  }).catch(err=>{
					  console.log(err)
				  })
			}
		}
	}
</script>

<style>
	.title {
		text-align: center;
		margin: 5px 0;
		position: relative;
	}

	.title .over {
		color: rgb(255, 81, 81);
		position: absolute;
		font-size: 14px;
		top: 2px;
	}

	.u-icon,
	.over {
		margin-right: 5px;
	}

	.over {
		font-size: 14px;
		color: #18BC37;
		height: 20px;
		line-height: 20px;
		margin-top: 5px;
	
	}
	.cancle {
		font-size: 12px;
		margin-right: 10px;
		padding: 5px;
		color: #fff;
		box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
		border: 1px solid #ccc;
		background-color: rgb(255, 86, 86);
	}
	.title text {
		position: absolute;
		right: 10px;
		top: 5px;
	}

	.tags {
		display: flex;
		justify-content: space-around;
		margin: 10px 0;
		padding: 10px 0;
		border-bottom: 1px solid #ccc;
	}

	.follow-list {
		margin-top: 15px;
	}

	.item {
		display: flex;
		align-items: center;
		border-bottom: 1px solid #ccc;
	}

	.item:nth-child(even) {
		background-color: #f2f2f2;
	}

	.item image {
		width: 40px;
		padding: 5px 10px;
		height: 40px;
		border-radius: 50%;
	}

	.name {
		font-size: 14px;
		flex: 1;
		color: rgb(166, 166, 255);
	}

	.active {
		color: red;
		background-color: rgb(213, 213, 255);
	}
</style>
