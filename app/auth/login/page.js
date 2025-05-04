import React, { Suspense } from 'react'
import LoginForm from './LoginForm'

function Login() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    )
}

export default Login
