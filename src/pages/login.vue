<template>
    <div class="container">
        <Alert v-if="alert.show" :type="alert.type" :msg="alert.msg" @closeAlert="setAlert(false, 'error', false)" />
        <div class="card">
            <h2 class="card-title">Авторизация</h2>
            <form @submit.prevent="login">
                <div class="form-group">
                    <label for="login" class="form-label">Логин или Телефон</label>
                    <div class="input-wrapper">
                        <span class="icon">
                            <img src="./../assets/icon/tel.svg" alt="icon">
                        </span>
                        <input type="text" id="login" placeholder="+7" class="input-field" v-model="user_login"
                            required />
                    </div>
                </div>

                <div class="form-group">
                    <label for="password" class="form-label">Пароль</label>
                    <div class="input-wrapper">
                        <span class="icon">
                            <img src="./../assets/icon/password.svg" alt="icon">
                        </span>
                        <input :type="showPass ? 'text' : 'password'" id="password" placeholder="Пароль"
                            class="input-field" v-model="user_password" required />
                        <img style="cursor: pointer" @click="showPassword()" src="./../assets/icon/show.svg" alt="icon">
                    </div>
                </div>

                <Button type="submit" msg="Войти" class="btn" />
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Button from './../interfaceAdapters/components/ui/button/button.vue';
import Alert from './../interfaceAdapters/components/ui/alert/alert.vue';
import { __API_URL } from '../usecases/URL';
export default {
    name: 'LoginPage',
    components: {
        Button, Alert
    },
    data() {
        return {
            user_login: '',
            user_password: '',
            showPass: false,

            alert: {
                show: false,
                type: 'error',
                msg: null
            }
        };
    }, methods: {
        setAlert(e, msg, show) {
            if (e) {
                this.alert.msg = msg;
                this.alert.type = 'success'
            }
            if (!e) {
                this.alert.msg = msg;
                this.alert.type = 'error'
            }
            this.alert.show = show;
        },
        async login() {
            try {
                let response = await axios.post(`${__API_URL}/auth/login/`, {
                    username: this.user_login,
                    password: this.user_password
                });
                if (response.status === 200) {
                    localStorage.setItem('tokken', response.data.key);
                    localStorage.setItem('employee_id', response.data.employee_id);
                    this.setAlert(true, 'Успешно!', true);
                    this.$router.push('/');
                }
            } catch (error) {
                this.setAlert(false, error, true);
            }
        },
        showPassword() {
            this.showPass = !this.showPass;
        },
    }
};

</script>

<style lang="sass" scoped>
.container 
    display: flex
    position: relative
    justify-content: center
    align-items: center
    width: 100%
    height: 100vh
    background: url('https://s3-alpha-sig.figma.com/img/a7be/90cd/076dc3828d4323a8f6f5d083dfaff115?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LMFpPd2T5jfo7MCR35ZsnCuEWMQAzPqKW8GIHuNc1N73dXHQ8HFZ1Jg~5HAcx0VmrkPZgmhn4bHXvYZOcz9ogXESy8HbwWvwXkMKUkg9oTArUampX2K5Jn4FHTm0Bs6Jk3smsTrDz1K7Qbq7fryve6XU6l2Mx4B8FEi3CqLuNPlkSPrzPwy3Yo6qrm6CSK-FNFLXPT6r~pJWvvYC7xFHpYwrS7zpyliYjY5VGyPZfhQTHSygZNCSypuZEmSqrpl7QE3mqT5TVQAyEuIElrU14NvDzxG2zs-dedHTAWReeg~fOeZ5gU2gMR-fuG83k1HC4Uam-pqlHD7M~6Ki7MVNsw__') no-repeat center center
    background-size: cover


.card 
    background: white
    padding: 20px
    border-radius: 8px
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2)
    text-align: center
    width: 320px


.card-title 
    font-size: 20px
    font-weight: bold
    margin-bottom: 20px


.form-group 
    margin-bottom: 15px
    text-align: left


.form-label 
    display: block
    margin-bottom: 5px
    font-size: 14px
    color: #333


.input-wrapper 
    display: flex
    align-items: center
    border: 1px solid #ccc
    border-radius: 4px
    padding: 5px
    background: #f9f9f9


.icon 
    display: flex
    margin-right: 12px
    font-size: 18px


.input-field 
    flex: 1
    border: none
    outline: none
    background: none
    padding: 8px


.input-field::placeholder 
    color: #aaa

</style>