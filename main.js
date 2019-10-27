// AXIOS GLOBALS
axios.defaults.headers.common['X-AUTH-Token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

// GET REQUEST
function getTodos() {
  // long version
  // axios({
  //   method: 'get',
  //   url: 'https://jsonplaceholder.typicode.com/posts',
  //   // url parameter with specifies that api should return
  //   // 5 elements instead of 100 which is default amount
  //   params: { _limit: 5 }
  // })
  //   .then(res => showOutput(res))
  //   .catch(err => console.error(err))

  // short version, get request is default but it's better
  // to specify since the code is more readable then
  axios('https://jsonplaceholder.typicode.com/posts?_limit=5', { timeout: 5000 })
    .then(res => showOutput(res))
    .catch(err => console.error(err))
}

// POST REQUEST
function addTodo() {
  // // long version
  // axios({
  //   method: 'post',
  //   url: 'https://jsonplaceholder.typicode.com/posts',
  //   data: {
  //     userId: 2,
  //     title: 'Beautiful weather',
  //     body: 'Today is a beautiful weather'
  //   }
  // })
  //   .then(res => showOutput(res))
  //   .catch(err => console.error(err))

  // short version
  axios.post('https://jsonplaceholder.typicode.com/posts', {
      userId: 2,
      title: 'Beautiful weather',
      body: 'Today is a beautiful weather'
    }
  )
    .then(res => showOutput(res))
    .catch(err => console.error(err))
}

// PUT/PATCH REQUEST
// PUT request updates the whole thing whereas PATCH just partially
function updateTodo() {
  // axios.put('https://jsonplaceholder.typicode.com/posts/1', {
  //     userId: 1,
  //     title: 'Beautiful weather',
  //     body: 'Today is a beautiful weather'
  //   }
  // )
  //   .then(res => showOutput(res))
  //   .catch(err => console.error(err))

  axios.patch('https://jsonplaceholder.typicode.com/posts/1', {
      title: 'Beautiful weather'
    }
  )
    .then(res => showOutput(res))
    .catch(err => console.error(err))
}

// DELETE REQUEST
function removeTodo() {
  axios.delete('https://jsonplaceholder.typicode.com/posts/1')
    .then(res => showOutput(res))
    .catch(err => console.error(err))
}

// SIMULTANEOUS DATA
function getData() {
  axios
    .all([
      axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5'),
      axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
    ])
    .then(
      // res => showOutput(res[1])
      // or
      axios.spread((posts, todos) => showOutput(posts))
      )
    .catch(err => console.error(err))
}

// CUSTOM HEADERS
function customHeaders() {
  const config = {
    headers: {
      'ContentType': 'application/json',
      Authorization: 'token'
    }
  }

  axios.post('https://jsonplaceholder.typicode.com/posts', {
      userId: 2,
      title: 'Beautiful weather',
      body: 'Today is a beautiful weather'
    },
    config
  )
    .then(res => showOutput(res))
    .catch(err => console.error(err))
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  const options = {
    method: 'post',
    url: 'https://jsonplaceholder.typicode.com/posts',
    data: {
      userId: 2,
      title: 'Beautiful weather',
      body: 'Today is a beautiful weather'
    },
    transformResponse: axios.defaults.transformResponse.concat(data => {
      data.title = data.title.toUpperCase();
      return data
    })
  }

  axios(options).then(res => showOutput(res))
}

// ERROR HANDLING
function errorHandling() {
  axios('https://jsonplaceholder.typicode.com/postss', {
    validateStatus: function(status) {
      return status < 500; // reject only if status is greater or equal to 500
    }
  })
  .then(res => showOutput(res))
  .catch(err => {
    if (err.response) {
      // server responded with something other than 2XX
      console.log(err.response.data)
      console.log(err.response.status)
      console.log(err.response.headers)
    }
  })
}

// CANCEL TOKEN
// Not clear is its application
function cancelToken() {
  const source = axios.CancelToken.source();

  axios('https://jsonplaceholder.typicode.com/posts?_limit=5', {
    cancelToken: source.token
  })
    .then(res => showOutput(res))
    .catch(thrown => {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message)
      }
    });

    if (true) {
      source.cancel('Request canceled')
    }
}

// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use(config => {
  console.log(`${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().getTime()}`);
  return config;
}, error => Promise.reject(error));

// AXIOS INSTANCES
const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
});

// axiosInstance.get('/comments').then(res => showOutput(res));

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);