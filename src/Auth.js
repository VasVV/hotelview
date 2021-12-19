import './auth.css';
import {useState} from 'react'; 
import { useNavigate } from "react-router-dom";


function Auth() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const formSubmit = e => {
        e.preventDefault();
        if ( /^[^а-яё]{8,}$/.test(password) && /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z0-9]+$/.test(email) ) {
            localStorage.setItem('isLoggedIn', true)
            navigate('/hotels');
        } else if (!/^[^а-яё]{8,}$/.test(password)) {
            setPasswordError(true)
        } else {
            setEmailError(true);
        }
    }

    return (
        <div className="auth">  
        <div className="auth__bg"></div>
            <div className="auth__form">   
                <p className="auth__form__header">Simple Hotel Check</p>    
                <div>
                    <form className="auth__form__inner" onSubmit={(e) => formSubmit(e)}>
                        <div className="auth__form__inner__group">
                            <label className={`auth__form__inner__group__label ${emailError ? 'error-text' : ''}`} for="email">Логин</label>
                            <input type="email" className={`auth__form__inner__group__field ${emailError ? 'error-border error-text' : ''}`} id='email' onChange={(e) => setEmail(e.target.value)} />
                            {emailError ? <span className="auth__form__inner__group__error" >Неверный e-mail</span> : ''}
                        </div>
                        <div className="auth__form__inner__group">
                            <label className={`auth__form__inner__group__label ${passwordError ? 'error-text' : ''}`} for="password">Пароль</label>
                            <input type='password' className={`auth__form__inner__group__field ${passwordError ? 'error-border error-text' : ''}`} id='password' onChange={(e) => setPassword(e.target.value)} />
                            {passwordError ? <span className="auth__form__inner__group__error" >Неверный пароль</span> : ''}
                        </div>
                        <button className="auth__form__submit" type='submit'>
                            <span className="auth__form__submit__text">Войти</span> 
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Auth;