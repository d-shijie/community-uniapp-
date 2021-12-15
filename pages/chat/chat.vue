<template>
	<view class="chat">
		<view class="top">
			<text>{{ info.username }}</text>
		</view>
		<scroll-view scroll-y="true" :scroll-into-view="scrollInto">
			<view class="chat-box" >
				<view class="item" v-for="item in chatList" :key="item.id">
					<image :class="{ my: item.userId == userId }" 
						:src="item.userId == userId ? headImg : info.headImg" alt="" />
			
					<view class="box" :class="{ right: item.userId == userId }">
						<view v-show="item.userId != userId" class="left-icon"></view>
						<text class="msg" :class="{ my2: item.userId == userId }">{{
			              item.msg
			            }}</text>
						<view v-show="item.userId == userId" class="right-icon"></view>
					</view>
				</view>
			</view>
		</scroll-view>
	
		<view class="input">
			<input v-model="message" type="text" />
			<button @click="send" size="mini" round>发送</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				info: {
					username: "",
					headImg: "",
				},
				headImg: "",
				message: "",
				chatList: [],
				userId: 0,
				scrollInto:''
			}
		},
		computed: {

		},
		onShow() {
			let that = this
			uni.getStorage({
				key: 'userId',
				success: function(res) {
					that.userId = res.data
				}
			})
			this.$nextTick(function() {
				setTimeout(() => {
					uni.pageScrollTo({
						scrollTop: 99999,
						duration: 0
					});
				}, 50);
			});
		},
		onLoad(option) {
			this.id = option.id
			let that = this
			uni.getStorage({
				key: 'userId',
				success: function(res) {
					that.userId = res.data
					that.$http({
						url: '/userDetail/' + res.data
					}).then(res => {
						that.headImg = res.data.headImg;
					}).catch(err => {
						console.log(err)
					})
				}
			})
			this.$http({
				url: '/userDetail/' + this.id
			}).then(res => {
				this.info.username = res.data.username;
				this.info.headImg = res.data.headImg;
			}).catch(err => {
				console.log(err)
			})

			this.getMessages()
		},
		methods: {
			getMessages() {
				let that = this
				uni.getStorage({
					key: 'userId',
					success: function(res) {
						that.$http({
							url: '/messages',
							data: {
								userId: res.data,
								followId: that.id
							}
						}).then(res => {
							that.chatList = res.data.rows;
							that.setScroll()
						}).catch(err => {
							console.log(err)
						})
					}
				})
			},
			send() {
				let body = {};
				body.followId = this.id;
				body.msg = this.message;
				uni.getStorage({
					key: 'userId',
					success: (res) => {
						body.userId = res.data
						this.$http({
							url: '/sendMessage',
							method: 'POST',
							data: body
						}).then(res => {
							this.getMessages()
							this.message = ''
							this.setScroll()
						}).catch(err => {
							console.log(err)
						})
					}
				})
			},
			setScroll(){
				let length=this.chatList.length
				let round=Math.ceil(Math.random()*10000000000000000)
				this.scrollInto='s'+(length-1)
			}
		}
	}
</script>

<style>
	.content {
		height: 74vh;
		overflow: hidden;
	}

	image {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.top {
		position: fixed;
		z-index: 1000;
		display: flex;
		padding: 10px;
		top: 0;
		width: 100%;
		background-color: #fff;
		align-content: center;
		font-size: 16px;
		justify-content: center;
		border-bottom: 1px solid #ccc;
	}

	/* .top text:nth-child(1) {
		margin-left: 10px;
	}

	.top text:nth-child(3) {
		margin-right: 10px;
		color: rgb(131, 131, 131);
	}

	.top text:nth-child(2) {
		flex: 1;
		font-size: 16px;
		text-align: center;
	}
 */
	.chat-box {
		width: 100%;
		height: 100%;
		margin-top: 40px;
		overflow: hidden;
		position: relative;
	}

	.input {
		position: fixed;
		bottom: 0;
		width: 100%;
		align-items: center;
		background-color: #f2f2f2;
		border-top: 1px solid #ccc;
		display: flex;
		padding-bottom: 17px;
		justify-content: space-around;
	}

	input {
		font-size: 12px;
		border: 1px solid #00AAFF;
		width: 70%;
		padding-left: 5px;
		position: relative;
		top: 10px;
		margin-left: 10px;
		border-radius: 10px;
	}

	button {
		position: relative;
		top: 10px;
	}

	.item {
		position: relative;
		display: flex;
		align-items: center;
		margin: 10px 5px;
	}

	.item img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.box {
		width: 50vw;
	}

	.msg {
		margin-left: 5px;
		background-color: rgb(147, 147, 255);
		padding: 5px 10px;
		border-radius: 20px;
		font-size: 12px;
		position: relative;
		top: 5px;
	}

	.my {
		position: relative;
		right: -80vw;
	}

	.right {
		position: relative;
		right: -16vw;
		top: 10px;
		text-align: right;
		color: #fff;
	}

	.left-icon,
	.right-icon {
		width: 0;
		height: 0;
		position: relative;
	}

	.left-icon {
		border-right: 5px solid rgb(147, 147, 255);
		border-bottom: 5px solid transparent;
		border-top: 5px solid rgb(147, 147, 255);
		border-left: 5px solid transparent;
		top: 14px;
		right: -5px;
	}

	.right-icon {
		border-right: 5px solid transparent;
		border-bottom: 5px solid transparent;
		border-top: 5px solid rgb(147, 147, 255);
		border-left: 5px solid rgb(147, 147, 255);
		top: -16px;
		right: -151px;
	}
</style>
