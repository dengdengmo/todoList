import AV from 'leancloud-storage'

const appId = 'yj8DdDih4hCkRzR3dlyb9HVa-gzGzoHsz';
const appKey = 'dYUOTxMvqaOFTzIynsiIHub7';
AV.init({ appId, appKey });

export const FolderModel = {
    // 加载数据
    getByUser(user, successFn, errorFn) {
        let query = new AV.Query('Folder')
        query.find().then((response) => {
            let array = response.map((t) => {
                return {id: t.id, ...t.attributes}
            })
            successFn.call(null, array)
        }, (error) => {
            errorFn && errorFn.call(null, error)
        })
    },
    // 创建folder
    create({ name, deleted}, successFn, errorFn){
        let Folder = AV.Object.extend('Folder')
        let folder = new Folder()
        folder.set('name', name)
        folder.set('deleted', deleted)

        // 设置folder只能被当前用户看到
        let acl = new AV.ACL()
        acl.setPublicReadAccess(false)
        acl.setWriteAccess(AV.User.current(), true)
        acl.setReadAccess(AV.User.current(), true)
        folder.setACL(acl)

        folder.save().then(function(response) {
            successFn.call(null, response.id)
        }, function(error) {
            errorFn && errorFn.call(null, error)
        })
    },
    // 更新folder
    update({id, deleted}, successFn, errorFn) {
        let folder = AV.Object.createWithoutData('Folder', id)
        deleted !== undefined && folder.set('deleted', deleted)
        console.log(id)
        folder.save().then((response) => {
            successFn && successFn.call(null)
        }, (error) => {
            errorFn && errorFn.call(null, error)
        })
    },
    // 删除folder
    destroy(folderId, successFn, errorFn) {
        let folder = AV.Object.createWithoutData('Folder', folderId)
        folder.destroy().then(function　(response) {
            successFn && successFn.call(null, response.id)
        }, function (error) {
            errorFn && errorFn.call(null, error)
        })
    }
}

export const TodoModel = {
    getByUser(user, successFn, errorFn) {
        let query = new AV.Query('Todo')
        query.find().then((response) => {
            let array = response.map((t) => {
                return {id: t.id, ...t.attributes}
            })
            successFn.call(null, array)
        }, (error) => {
            errorFn && errorFn.call(null, error)
        })
    },
    create({ title, deleted, inFolder}, successFn, errorFn){
        let Todo = AV.Object.extend('Todo')
        let todo = new Todo()
        todo.set('title', title)
        todo.set('deleted', deleted)
        todo.set('inFolder', inFolder)
        
        let acl = new AV.ACL()
        acl.setPublicReadAccess(false)
        acl.setWriteAccess(AV.User.current(), true)
        acl.setReadAccess(AV.User.current(), true)
        todo.setACL(acl)

        todo.save().then(function(response) {
            successFn.call(null, response.id)
        }, function(error) {
            errorFn && errorFn.call(null, error)
        })
    },
    update(todoo, successFn, errorFn) {
        let todo = AV.Object.createWithoutData('Todo', todoo.id)
        console.log(todoo.id)
        console.log(todoo.status)
        todo.set('status', todoo.status)
        todo.save().then((response) => {
            successFn && successFn.call(null)
        }, (error) => {
            errorFn && errorFn.call(null, error)
        })
    },
    destroy(todoId, successFn, errorFn) {
        let todo = AV.Object.createWithoutData('Todo', todoId)
        todo.destroy().then(function　(response) {
            successFn && successFn.call(null)
        }, function (error) {
            errorFn && errorFn.call(null, error)
        })
    }
}

export function signUp(username, password, email, successFn, errorFn) {
    // 新建AVUser 对象实例
    const user = new AV.User()
    // 设置用户名、密码、邮箱
    user.setUsername(username)
    user.setPassword(password)
    user.setEmail(email)
    user.signUp().then(function (loginedUser){
        let user = getUserFromAVUser(loginedUser)
        successFn.call(null, user)
    }, function (error){
        errorFn.call(null, error)
    })
    return undefined
}
export function signIn(username, password, successFn, errorFn) {
    AV.User.logIn(username, password).then(function (loginedUser) {
        let user = getUserFromAVUser(loginedUser)
        successFn.call(null, user)
    }, function (error){
        errorFn.call(null, error)
    })
}
export function signOut() {
    AV.User.logOut()
    return undefined
}
export function getCurrentUser() {
    let user = AV.User.current()
    if(user) {
        return getUserFromAVUser(user)
    } else {
        return null
    }
}
export function sendPasswordResetEmail(email, successFn, errorFn) {
    AV.User.requestPasswordReset(email).then(function (success) {
        successFn.call()
    }, function (error) {
        errorFn.call(null, error)
    })
}
function getUserFromAVUser(AVUser) {
    return {
        id: AVUser.id, ...AVUser.attributes
    }
}

export default AV;