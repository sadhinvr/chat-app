const User = class {
    constructor(myName) {
        this.myName = myName;
        this.sortName = this.myName.slice(0, 1).toUpperCase();
    }
}

let socket;

const state = {
    id: false,
    name: false
}

const user = {
    myName: undefined,
    sortName: undefined
}

const messages = {};
const app = document.querySelector('.app')

function chat(e) {

    state.id = e.id;
    state.name = e.dataset.name;

    app.innerHTML = `<div class="nav">
      <svg onclick="homeMock()" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
       viewBox="0 0 447.243 447.243" style="width:20px;margin-bottom:10px;" xml:space="preserve" fill="currentColor">
  <g>
      <g>
          <path d="M420.361,192.229c-1.83-0.297-3.682-0.434-5.535-0.41H99.305l6.88-3.2c6.725-3.183,12.843-7.515,18.08-12.8l88.48-88.48
              c11.653-11.124,13.611-29.019,4.64-42.4c-10.441-14.259-30.464-17.355-44.724-6.914c-1.152,0.844-2.247,1.764-3.276,2.754
              l-160,160C-3.119,213.269-3.13,233.53,9.36,246.034c0.008,0.008,0.017,0.017,0.025,0.025l160,160
              c12.514,12.479,32.775,12.451,45.255-0.063c0.982-0.985,1.899-2.033,2.745-3.137c8.971-13.381,7.013-31.276-4.64-42.4
              l-88.32-88.64c-4.695-4.7-10.093-8.641-16-11.68l-9.6-4.32h314.24c16.347,0.607,30.689-10.812,33.76-26.88
              C449.654,211.494,437.806,195.059,420.361,192.229z"/>
      </g>
  </g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
  </svg>
    </div>
    <div class="messages_holder" id="msgs">
      
      <div class="message_wraper ">
        <span class="user user-1">J</span>
        <div class="message"> hello world!</div>
      </div>
      <div id="you" class="message_wraper">
        <span class="user user-2">S</span>
        <div class="message"> hello world!</div>
      </div>
      
    </div>
    
    <form action="" class="envolope" id="form">
      <input type="text" placeholder="Aaa" class="inp" name="message" id="input">
      <button type="submit" class="sub-btn">Sent</button>
    </form>`;

    var form = document.getElementById('form');
    var input = document.getElementById('input');

    if (messages[state.id]) {
        messages[state.id].map(obj => {
            textMock(obj.text, obj.you);
        })
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (input.value) {
            const data = JSON.stringify({
                id: state.id,
                msg: input.value
            })
            socket.emit('send', data);

            messages[data.id] = messages[data.id] || [];
            messages[data.id].push({
                you: true,
                text: input.value
            });

            textMock(input.value, true)
            input.value = '';
        }
    });
}

function textMock(msg, you) {
    var msgs = document.getElementById('msgs');
    msgs.insertAdjacentHTML('beforeend', `
            <div class="message_wraper " ${you && 'id="you"'}>
                <span class="user" title="${you?'you':state.name}">${(you?'you':state.name).slice(0, 1).toUpperCase()}</span>
                <div class="message"> ${msg} </div>
            </div>
            `)
}

function homeMock() {
    state.id = false;
    state.name = false;
    app.innerHTML = `<div class="profile">
    <div class="img">${user.sortName}</div>
    <div class="me">${user.myName}</div>
  </div>
  <div class="active_users">
      <p style="margin-left:4px;margin-bottom:10px">Active Now</p>
  </div>`;

    getUsers();
}

function home() {
    homeMock();

    socket = io();
    socket.on('active', (u) => {
        if (!state.id) {
            console.log(state.id)
            u = JSON.parse(u);
            usersAppend(Object.values(u)[0], Object.keys(u)[0]);
            noOne();
        }

    });

    socket.on('getid', (id) => {
        if (!state.ownid) {
            state.ownid = id
        }
    });

    socket.on('disconnected', id => {
        try {
            document.getElementById(id).remove()
            noOne()
        } catch (err) {};

    });

    socket.on('receive', (data) => {
        data = JSON.parse(data);
        messages[data.id] = messages[data.id] || [];
        messages[data.id].push({
            you: false,
            text: data.msg
        });

        if (state.id === data.id) {
            textMock(data.msg, false);
        }
    })
    socket.emit('active', user.myName);
}

async function getUsers() {
    const aUsers = document.querySelector('.active_users');
    let data = await fetch('/users', {
            method: 'GET'
        })
        .then(response => response.json());
    delete data[state.ownid]

    if (Object.keys(data).length > 0) {
        for (const i in data) {
            usersAppend(data[i], i, aUsers);
        }
    }

    noOne();
}

function noOne() {
    const no = document.getElementById('no-user');
    const aUsers = document.querySelector('.active_users');
    const users = document.querySelectorAll('.active_user').length;
    if (users < 1 && !no) {
        aUsers.insertAdjacentHTML('beforeend', `
    <p id="no-user">no one active 😒</p> `)

        return;
    }

    no && no.remove()

}

const registryMock = `<div class="doc">
<h1>Sadhinvr</h1>

</div>
<form class="regiter" style="flex:1;margin-top:30px" id="reg">
  <label for="reg-name" style="margin-bottom:10px;display:block;">Your Name</label>
<div class="envolope">
  <input type="text" class="inp" id="reg-name" placeholder="name" required name="name">
  <button class="sub-btn">Let's Chat</button>
</div>
</form>
`;


function setState(newState) {
    if (newState == 'home') {
        home();
        return;
    } else if (newState == 'chat') {
        chat()
        return;
    }
    reg();
}

setState();


function reg() {
    app.innerHTML = registryMock;
    const reg = document.getElementById('reg');
    const regName = document.getElementById('reg-name');

    reg.addEventListener('submit', e => {
        e.preventDefault();
        if (!regName.value) {
            return;
        }
        const tempuser = new User(regName.value);
        user.myName = tempuser.myName;
        user.sortName = tempuser.sortName;
        setState('home');
        // fetch(`/${user.myName}`)
    })
}

function usersAppend(myname, id, aUsers) {
    const tempuser = new User(myname);
    document.querySelector('.active_users').insertAdjacentHTML('beforeend', `
    <div class="active_user" id="${id}" onclick="chat(this)" data-name="${tempuser.myName}">
        <div class="img">${tempuser.sortName}</div>
        <div class="user_name">${tempuser.myName}</div>
      </div>
    `)
}