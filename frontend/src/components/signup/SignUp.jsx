import { useState } from 'react'
import './signUp.scss'
import { useAuth } from '../../services/auth.service';

export default function SignUp() {
    const {signup} = useAuth();

    const requiredDetails = ["email", "username", "password"];

    const [userDetail, setUserDetail] = useState(
        /*()=>{
            let tmp = {};
            requiredDetails.map((detail)=>{
                tmp = {...tmp, [detail]: null}
            })
            return tmp;
        }*/
        Object.fromEntries(requiredDetails.map(detail=> [detail,null]))
    );

    const [message,setMessage] = useState("");

    const handleDetailChange = (e) => {
        setUserDetail((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }
    
    const handleSignUp = () => {
        console.log(userDetail);
        signup(userDetail).then(
            (e)=>{
                setMessage(e.message);
            },
            error=>{
                setMessage(error.message);
            }
        )
    }

    function capitalizeFirstLetter(e){
        return String(e).charAt(0).toUpperCase() + String(e).slice(1);
    }

    return (
        <div className='sign-up'>
            <div className='sign-up-form'>
                {requiredDetails.map((item) => {
                    return (
                        <div className='form-group'>
                            <input
                                placeholder={item}
                                type="text"
                                name={item}
                                onChange={handleDetailChange}
                                className="form-field"
                                required
                            ></input>
                            <label for={item} className='form-label'>{capitalizeFirstLetter(item)}</label>
                        </div>
                    );
                })}
                <div>{message}</div>
                <button
                className='sign-up-btn'
                onClick={handleSignUp}>
                    Sign Up
                </button>
            </div>
        </div>
    )
}