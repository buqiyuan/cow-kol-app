<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="login-type">
				<view @tap="loginType = 'LoginByAccount'" :class="{active: loginType === 'LoginByAccount'}" class="login-tab">
					手机号登录
				</view>
				<view @tap="loginType = 'LoginByEmail'" :class="{active: loginType === 'LoginByEmail'}" class="login-tab">
					邮箱登录
				</view>
			</view>
			<view v-show="loginType == 'LoginByAccount'" class="input-content">
				<view class="input-item">
					<input type="text" v-model="formData.phoneNumber" placeholder="请输入手机号码" />
				</view>
				<view class="input-item">
					<input type="text" password v-model="formData.password" placeholder="请输入密码" placeholder-class="input-empty"
					 maxlength="20" @confirm="toLogin" />
				</view>
			</view>
			<view v-show="loginType == 'LoginByEmail'" class="input-content">
				<view class="input-item">
					<input type="number" maxlength="11" v-model="phoneFormData.phone" placeholder="请输入邮箱" />
				</view>
				<view class="input-item">
					<input type="password" v-model="phoneFormData.code" placeholder="请输入验证码" placeholder-class="input-empty" maxlength="6"
					 password @confirm="toLogin" />
				</view>
			</view>
			<button class="confirm-btn" @tap="toLogin" :disabled="canClickLogin">登录</button>
			<view class="forget-section">
				忘记密码?
			</view>
		</view>
		<view class="register-section">
			还没有账号?
			<text @tap="toRegist">马上注册</text>
		</view>
	</view>
</template>

<script>
	import service from '../../service.js';
	import {
		mapState,
		mapActions
	} from 'vuex'
	import mInput from '../../components/m-input.vue'

	export default {
		components: {
			mInput
		},
		data() {
			return {
				codeTimer: null,
				logining: false,
				loginType: 'LoginByAccount', // 登录方式
				formData: { // 账号密码登录
					phoneNumber: '',
					password: ''
				},
				phoneFormData: { // 手机号码登录
					phone: '',
					code: ''
				}
			}
		},
		computed: {
			canClickLogin() {
				if (this.loginType == 'LoginByAccount') {
					let {
						phoneNumber,
						password
					} = this.formData
					return phoneNumber.trim().length < 2 || password.trim().length < 6
				} else if (this.loginType == 'LoginByEmail') {
					let {
						phone,
						code
					} = this.phoneFormData
					return phone.trim().length !== 11 || code.trim().length !== 6
				}
				return logining
			}
		},
		methods: {
			...mapActions('user', ['LoginByAccount', 'LoginByEmail']),
			async toLogin() {
				this.logining = true
				let formType = {
					LoginByAccount: this.formData,
					LoginByEmail: this.phoneFormData
				}
				let result = await this[this.loginType](formType[this.loginType])
				console.log(result, '登录结果')
				if (result.statusCode == 200) {
					uni.showToast({
						title: '登录成功！',
						icon: 'success'
					})
					this.$Router.pushTab({name: 'index'})
				} else {
					let content = {
						401:  "密码错误",
						403: '失败次数过多，请稍后重试',
						404: '手机号码不存在',
						410: '为了你的账号安全，请重置密码'
					}[result.statusCode] || '登录时出现错误'

					uni.showModal({
						title: '提示',
						content: content
					})
				}
				this.logining = false
			},
			toRegist() {
				// uni.navigateTo({
				// 	url:'../reg/reg'
				// })
				uni.showModal({
					title: '验证码登录即注册！'
				})
			},
			async getEmail() {
				// this.getEmail
				let {
					phone
				} = this.phoneFormData
				let res = await this.$minApi.user.getEmail({
					phone
				})
				let time = 60 * 5
				if (res.code === 0) {
					this.codeTimer = setInterval(() => {
						this.phoneCodeText = `重新发送(${--time}s)`
						if (time <= 0) clearInterval(this.codeTimer)
					}, 1000)
				}
				uni.showToast({
					title: res.msg
				})
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.container {
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 90;
		background: #fff;
		padding-bottom: 40rpx;
	}

	.back-btn {
		position: absolute;
		left: 40rpx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40rpx;
		font-size: 40rpx;
		color: $font-color-dark;
	}

	.left-top-sign {
		font-size: 120rpx;
		color: $page-color-base;
		position: relative;
		left: -16rpx;
	}

	.right-top-sign {
		position: absolute;
		top: 80rpx;
		right: -30rpx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 400rpx;
			height: 80rpx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198rpx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270rpx;
		bottom: -320rpx;
		border: 100rpx solid #d0d1fd;
		border-radius: 50%;
		padding: 180rpx;
	}

	.login-type {
		position: relative;
		display: flex;
		left: 0;
		top: -80rpx;
		font-size: 40rpx;
		color: #ccc;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);

		.login-tab {
			margin-right: 20rpx;

			&.active {
				color: #555;
			}
		}
	}

	.input-content {
		padding: 0rpx;
	}

	.input-item {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30rpx;
		background: $page-color-light;
		height: 96rpx;
		border-radius: 4px;
		margin-bottom: 50rpx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50rpx;
			line-height: 56rpx;
			font-size: $font-sm+2rpx;
			color: $font-color-base;
		}

		input {
			height: 60rpx;
			font-size: $font-base + 2rpx;
			color: $font-color-dark;
			width: 100%;
		}

		.phone-code {
			position: absolute;
			right: 12rpx;
			font-size: 30rpx;
			color: #4399FC;
			z-index: 20;

			&.disabled {
				color: #CCCCCC;
				pointer-events: none;
			}
		}
	}

	.confirm-btn {
		width: 630rpx;
		height: 76rpx;
		line-height: 76rpx;
		border-radius: 50px;
		margin-top: 70rpx;
		background: $uni-bg-color;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
		}
	}

	.forget-section {
		font-size: $font-sm+2rpx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40rpx;
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 50rpx;
		width: 100%;
		font-size: $font-sm+2rpx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10rpx;
		}
	}
</style>
