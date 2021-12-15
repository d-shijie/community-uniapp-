<template>
	<view class="event">
		<view class="top">
			<view class="tag" v-if="userInfo.category === 0">推荐区</view>
			<view class="tag" v-if="userInfo.category === 1">生活区</view>
			<view class="tag" v-if="userInfo.category === 2">政治区</view>
			<view class="tag" v-if="userInfo.category === 3">娱乐区</view>
		</view>
		<view class="event-detail">
			<view class="title">
				{{ userInfo.title }}
			</view>
			<view class="user">
				<view @click="gotoUserDetail" class="head">
					<image :src="headImg" alt="" />
				</view>
				<view @click="gotoUserDetail" class="username">
					<text> {{ userInfo.name }}</text>
					<text>{{ interval | timeFormat }}</text>
				</view>
				<button @click="follow" size="mini">关注</button>
			</view>
			<view class="content">
				{{ userInfo.content }}
			</view>
		</view>
		<view class="command">
			<view class="header">
				<text>全部评论</text>
				<button size="mini" @click="showCommand">评论</button>
			</view>
			<view @click="gotoUserDetail2(item.userId)" class="commamd-item" v-for="(item, index) in commands"
				:key="index">
				<view class="name">{{ item.name }}</view>
				<view class="content">{{ item.content }}</view>
			</view>
		</view>
		<u-transition duration='2000' mode='fade' :show="show">
			<view class="transition">
				<input v-model="content" type="text">
				<button @click="command" size="mini">发送</button>
			</view>
		</u-transition>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				userInfo: {},
				headImg: "",
				interval: 0,
				commands: [],
				show: false,
				content: "",
			}
		},
		onLoad(option) {
			this.id = option.id
			this.getCommands(option.id)
			this.userInfo = this.$store.state.profileInfo;
			this.getUserDetail(this.userInfo.userId)
			let nowFDate = Date.now();
			let timestamp = new Date(this.userInfo.createdAt).getTime();
			let interval = nowFDate - timestamp;
			this.interval = interval;
		},
		methods: {
			getCommands(id) {
				this.$http({
					url: '/command',
					data: {
						id
					}
				}).then(res => {
					this.commands = res.data.rows;
				}).catch(err => {
					console.log(err)
				})
			},
			getUserDetail(id) {
				this.$http({
					url: '/userDetail/' + id
				}).then(res => {
					this.headImg = res.data.headImg;
				}).catch(err => {
					console.log(err)
				})
			},
			gotoUserDetail() {
				uni.navigateTo({
					url: '../userDetail/userDetail?id=' + this.userInfo.userId
				})
			},
			gotoUserDetail2(id) {
				uni.navigateTo({
					url: '../userDetail/userDetail?id=' + id
				})
			},
			showCommand() {
				this.show = true;
			},
			command() {
				//username id content
				let body = {};
				body.eventId = this.id;
				body.content = this.content;
				let that=this
				let userId;
				uni.getStorage({
					key: 'userId',
					success: function(res) {
						userId = res.data
						body.userId=userId
						that.$http({
							url: '/userDetail/' + userId
						}).then(res => {
							body.username = res.data.username
							that.$http({url:'/command',data:body,method:'POST'}).then(res=>{
								console.log(res)
								that.getCommands(that.id)
								that.show = false
								that.content=''
							})
						})
					}
				})
			},
			follow(){
				let userId;
				let that=this
				uni.getStorage({
					key:'userId',
					success:function(res){
						userId=res.data
						that.$http({url:'/follow',data:{
							username:that.userInfo.name,
							followId:that.userInfo.userId,
							userId:userId
						},method:'POST'}).then(res=>{
							console.log(res)
						}).catch(err=>{
							console.log(err)
						})
					}
				})
			}
		},
		filters: {
			timeFormat(value) {
				let time = (value / 1000 / 60 / 24).toFixed(0);
				if (time >= 24) {
					return (time / 24).toFixed(0) + "天前";
				} else {
					if (time > 0) {
						return time + "小时前";
					} else {
						return "刚刚";
					}
				}
			},
		}
	}
</script>

<style lang="scss">
	.event {
		background-color: #f2f2f2;
		width: 100%;
		height: 100%;
		position: relative;
	}

	.top {
		background-color: #fff;
		width: 100%;
		display: flex;
		justify-content: space-around;
		/* position: relative; */
		padding: 10px 0;
	}

	.transition {
		background-color: #fff;
		width: 100%;
		border-top: 1px solid #ccc;
		position: fixed;
		bottom: 0;
		height: 50px;
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 10px;

		input {
			font-size: 12px;
			width: 65%;
			border-radius: 10px;
			border: 1px solid #00aaff;
		}
	}

	.tag {
		width: 40%;
		border-radius: 15px;
		padding: 2px 0;
		background-color: #ccc;
		color: rgb(121, 121, 253);
		font-size: 14px;
		font-weight: 600;
		text-align: center;
	}

	.event-detail {
		background-color: #fff;
		padding: 5px 10px;
	}

	.user {
		display: flex;
		align-items: center;
		margin: 10px 0;
	}

	.user .head image {
		width: 40px;
		border-radius: 50%;
		height: 40px;
	}

	.user .username {
		font-size: 13px;
		margin-left: 5px;
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
		color: rgb(104, 104, 255);
	}

	.user .username text:nth-child(1) {
		margin-top: -5px;
	}

	.user .username text:nth-child(2) {
		margin-top: 5px;
		color: #ccc;
	}

	.title {
		font-size: 18px;
		font-weight: 600;
	}

	.content {
		font-size: 14px;
		margin-bottom: 10px;
	}

	.command {
		margin-top: 10px;
		background-color: #fff;
		padding: 10px;
	}

	.header {
		display: flex;
		font-size: 12px;
		font-weight: 600;
		margin-bottom: 15px;
	}

	.header text:nth-child(1) {
		flex: 1;
	}

	.commamd-item {
		border-bottom: 1px solid #eee;
	}

	.name {
		font-size: 12px;
		margin: 10px 0;
	}

	.content {
		font-size: 14px;
		font-weight: 550;
	}

	.input {
		width: 100%;
		height: 50px;
		display: flex;
		background-color: #fff;
		position: absolute;
		bottom: 0px;
		justify-content: space-around;
		align-items: center;
		z-index: 999;
		border-top: 1px solid #ccc;
	}

	textarea {
		padding: 3px;
		resize: none;
		width: 70%;
		border-radius: 15px;
		height: 30px;
	}
</style>
