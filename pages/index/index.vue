<template>
	<view class="content">
		<view class="login">
			<view class="item"> 账号：<input v-model="body.username" type="text" value="" /></view>
			<view class="item"> 密码：<input v-model="body.password" type="password" value="" /></view>
			<view class="item">
				<button @click="login" type="default">登录</button>
			</view>
			<view @click="register" class="item register">注册账号</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				body: {
					username: 'dsj',
					password: '123456'
				}
			}
		},
		onLoad() {

		},
		methods: {
			login() {
				this.$http({
					url: '/login',
					data: this.body,
					method: 'POST'
				}).then(res => {
					if (res.data.user) {
						uni.setStorage({
							key: 'userId',
							data: res.data.user.id,
							success:function(){
								console.log('success')
							}
						})
						uni.switchTab({
							url: '../home/home'
						})
					} else {
						uni.showToast({
							title: '登录失败',
							icon: 'none',
							duration: 2000
						});
					}
				}).catch(err => {
					console.log(err)
				})
			},
			register() {
				this.$http({
					url: '/register',
					data: this.body,
					method: 'POST'
				}).then(res => {
					uni.showToast({
						title: res.data.msg,
						icon: 'none',
						duration: 2000
					});
				}).catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>

<style>
	.content {
		height: 100%;
		width: 100%;
	}

	.login {
		width: 100%;
		margin-top: 50px;
	}

	.item {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	input {
		border: 1px solid blue;
		margin: 10px 0;
		padding: 5px;
		border-radius: 10px;
		font-size: 12px;
	}

	.register {
		font-size: 12px;
		color: blue;
		margin-top: 10px;
	}

	button {
		font-size: 12px;
	}
</style>
