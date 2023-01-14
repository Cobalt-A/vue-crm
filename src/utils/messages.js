import localize from '@/filters/localize.filter' 

export default {
    'logout': localize('logout'),
    'login': localize('login'),
    'auth/user-not-found': localize('userNotFound'),
    'auth/wrong-password': localize('wrongPassword'),
    'auth/email-already-in-use': localize('emailAlreadyUse')
}