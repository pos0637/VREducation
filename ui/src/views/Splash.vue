<template>
    <a-layout class="container" style="background-image: url(splash/images/loginBackground.jpg)">
        <div class="header">
            <img src="splash/images/title.png" style="width: 830px;margin-top: -10px;" />
        </div>
        <a-layout-content type="flex" class="content">
            <a-form :form="form" class="user-layout-login login_div" ref="formLogin" id="formLogin" style="background-image: url(splash/images/border.png);">
                <a-col :span="24">
                    <a-form-item style="margin-top:30px;">
                        <a-row type="flex" justify="center" align="middle">
                            <a-col :span="6" style="text-align:right;">
                                <div class="color">用户名：</div>
                            </a-col>
                            <a-col :span="16" style="text-align:left;">
                                <input
                                    class="up"
                                    size="large"
                                    v-decorator="['username', validatorRules.username]"
                                    type="text"
                                    placeholder="请输入用户名 / admin"
                                    autocomplete="off"
                                />
                            </a-col>
                        </a-row>
                    </a-form-item>
                    <a-form-item>
                        <a-row type="flex" justify="center" align="middle">
                            <a-col :span="6" style="text-align:right;">
                                <div class="color">密 码 ：</div>
                            </a-col>
                            <a-col :span="16" style="text-align:left;">
                                <input
                                    class="up"
                                    v-decorator="['password', validatorRules.password]"
                                    size="large"
                                    type="password"
                                    autocomplete="off"
                                    placeholder="密码 / 123456"
                                />
                            </a-col>
                        </a-row>
                    </a-form-item>
                    <a-form-item>
                        <a-row type="flex" justify="center" align="middle">
                            <a-col :span="6" style="text-align:right;">
                                <div class="color">验证码：</div>
                            </a-col>
                            <a-col :span="16" style="text-align:left;">
                                <input
                                    class="up"
                                    v-decorator="['inputCode', validatorRules.inputCode]"
                                    size="large"
                                    type="text"
                                    @change="_inputCodeChanged"
                                    placeholder="请输入验证码"
                                    autocomplete="false"
                                    style="margin-right:10px;"
                                />
                                <img v-if="requestCodeSuccess" :src="randCodeImage" @click="_onChangeCheckCode" />
                                <img v-else src="../assets/checkcode.png" @click="_onChangeCheckCode" />
                            </a-col>
                        </a-row>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-row class="down" type="flex" justify="space-around" align="middle">
                        <a-button
                            class="clam login-button"
                            type="primary"
                            size="large"
                            htmlType="submit"
                            :loading="loginBtn"
                            @click.stop.prevent="_onLoginButtonClicked"
                            :disabled="loginBtn || !initializedSuccess"
                            >登录</a-button
                        >
                        <a-button :disabled="!initializedSuccess" class="clam" type="primary" @click.stop.prevent="_noAuthLogin">专家入口</a-button>
                    </a-row>
                </a-col>
            </a-form>
        </a-layout-content>
        <a-layout-footer style="background: #1c1717;opacity: 60%;">
            <div class="progress">
                <span style="font-size: 1.1rem; color: white;">{{ markedWords }}</span>
                <a-progress
                    :stroke-color="{
                        '0%': '#108ee9',
                        '100%': '#87d068'
                    }"
                    :percent="progress"
                />
            </div>
            <span style="color: white;font-size: 13px;">
                本实验基于最新的HTML5和WebGL技术开发，使用虚拟3D场景构建。建议使用Microsoft edge、Firefox、Google Chrome等浏览器访问。<br />
                如果使用其他谷歌内核的浏览器（如360、QQ、UC、猎豹、遨游等）请务必切换成极速模式，去掉鼠标手势，开启硬件加速。<br />
                如果遇到加载至99%长时间不进入实验的情况，请清除浏览器缓存，重新加载。<br />
                如果对实验资源还有其他疑问，请联系13045977553（林耶海工程师）18059143209（李老师）
            </span>
        </a-layout-footer>
    </a-layout>
</template>

<style scoped>
.content {
    display: flex;
    align-items: center;
}
.login_div {
    text-align: center;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    margin: 0px auto;
    padding-top: 50px;
    padding-bottom: 50px;
    width: 600px;
    height: 434px;
    align-content: center;
}

.container {
    position: relative;
    width: 100%;
    height: 100%;
    background-repeat: round;
    min-width: 920px;
    min-height: 612px;
}

.color {
    color: white;
    font-size: 22px;
    font-family: 黑体;
}

.up {
    width: auto;
    border: none;
    background: #fff;
    outline: none;
    border-bottom: 1px solid #fff;
    color: black;
    font-size: 22px;
    font-family: 黑体;
}

.down {
    width: 70%;
    margin: 0px auto;
}

.clam {
    height: 40px;
    margin-top: 55px;
    width: 120px;
}

.header {
    padding: 0;
    text-align: left;
    padding-left: 4%;
}

.ant-layout-footer {
    background: none;
    padding: 15px 50px;
}
</style>

<script>
import request from '@/miscs/request';
import { loginByUsername, noAuthLogin } from '@/api/login';

export default {
    data() {
        return {
            validatorRules: {
                username: { rules: [{ required: true, message: '请输入用户名!' }] },
                password: {
                    rules: [{ required: true, message: '请输入密码!', validator: 'click' }]
                },
                captcha: { rule: [{ required: true, message: '请输入验证码!' }] },
                inputCode: { rules: [{ required: true, message: '请输入验证码!' }] }
            },
            randCodeImage: '',
            currdatetime: '',
            loginBtn: false,
            inputCodeContent: '',
            form: this.$form.createForm(this),
            requestCodeSuccess: false,
            progress: 0,
            loginSuccess: false,
            initializedSuccess: false,
            markedWords: '正在加载, 请稍等......'
        };
    },
    created() {
        this._onChangeCheckCode();
    },
    mounted() {
        top.window.onUnityProgress = (sender, progress) => {
            this.progress = progress * 100;
        };

        top.window.onUnityInitialized = () => {
            this.initializedSuccess = true;
            if (this.loginSuccess) {
                this.$store.commit('changeScene', {
                    scene: 'introduction',
                    stage: null,
                    step: null
                });
            } else {
                this.markedWords = '加载完成，请登录。';
            }
        };
    },
    beforeDestroy() {
        top.window.onUnityInitialized = null;
    },
    methods: {
        _inputCodeChanged(e) {
            this.inputCodeContent = e.target.value;
        },
        _onChangeCheckCode() {
            this.currdatetime = new Date().getTime();
            request({
                url: `/sys/randomImage/${this.currdatetime}`,
                method: 'GET'
            })
                .then(res => {
                    if (res.success) {
                        this.randCodeImage = res.result;
                        this.requestCodeSuccess = true;
                    } else {
                        this.$message.error(res.message);
                        this.requestCodeSuccess = false;
                    }
                })
                .catch(() => {
                    this.requestCodeSuccess = false;
                });
        },
        _noAuthLogin() {
            noAuthLogin()
                .then(() => {
                    if (this.initializedSuccess) {
                        this.$store.commit('changeScene', {
                            scene: 'introduction',
                            stage: null,
                            step: null
                        });
                    } else {
                        this.markedWords = '登录成功。加载中，请稍等......';
                    }
                    this.loginSuccess = true;
                })
                .catch(() => {
                    this.$message.error('登陆失败，请重试');
                    this.loginSuccess = false;
                });
        },
        _onLoginButtonClicked() {
            this.loginBtn = true;
            // 使用账户密码登陆
            this.form.validateFields(['username', 'password', 'inputCode', 'rememberMe'], { force: true }, (err, values) => {
                if (!err) {
                    const loginParams = {};
                    loginParams.username = values.username;
                    loginParams.password = values.password;
                    loginParams.remember_me = values.rememberMe;
                    loginParams.captcha = this.inputCodeContent;
                    loginParams.checkKey = this.currdatetime;
                    loginByUsername(loginParams)
                        .then(() => {
                            if (this.initializedSuccess) {
                                this.$store.commit('changeScene', {
                                    scene: 'introduction',
                                    stage: null,
                                    step: null
                                });
                            } else {
                                this.markedWords = '登录成功。加载中，请稍等......';
                            }
                            this.loginBtn = false;
                            this.loginSuccess = true;
                        })
                        .catch(() => {
                            this.loginBtn = false;
                            this.loginSuccess = false;
                        });
                } else {
                    this.loginBtn = false;
                    this.loginSuccess = false;
                }
            });
        }
    }
};
</script>
