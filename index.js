const box = document.querySelector('.box')
const btnPost = document.querySelector('#btn-post')
const btnMark = document.querySelector('#btn-mark')
const btnDelete = document.querySelector('#btn-delete')
const btnUpdate = document.querySelector('#btn-update')
const inputBox = document.querySelector('.input-box')
const writeField = document.querySelector('#input')
const wrapper = document.querySelector('.wrapper')
const form = document.querySelector('.form-container')

// array jag lägger in objekten hämtat från databas eller görs på sidan
let posts = []

//för att kontrollera om completed är false eller true
let togglePut = false

let checkValidate = false

async function getData(){
    try {
        const response = await fetch('https://js1-todo-api.vercel.app/api/todos?apikey=af3092f0-c8c2-479b-83c3-a76ecb766e94')
        const data = await response.json()
   
        posts = data
        displayData()
        
        if(response.status !== 200){
            throw new Error('Something went wrong' + response.status)
        }
    } catch (error) {
        console.error(error.message)
    }
    

}

getData()

function displayData(){
    box.innerHTML = ''
    togglePut = false

    posts.forEach(post =>{
        const pElement = document.createElement('p')
        pElement.textContent = post.title
        pElement.classList.add('is-active')
        pElement.setAttribute("id",post._id)
        
        if(post.completed){
            pElement.classList.add('text-green')
        }

        pElement.addEventListener('click',()=>{
            pElement.classList.toggle('outline')
        })
        box.appendChild(pElement)
    })
}

async function addPost(input1){
const newPost ={
    title: input1
}
try {
    const response = await fetch('https://js1-todo-api.vercel.app/api/todos?apikey=af3092f0-c8c2-479b-83c3-a76ecb766e94',{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(newPost)
    }) 

    if(!response.ok){
        throw new Error('Something went wrong' + response.status)
    }
    
    const data = await response.json()
    posts.push(data)
    
    displayPostData(data)
    
} catch (error) {
    console.error(error.message)
}

  

}

btnPost.addEventListener('click',()=>{
    inputBox.innerHTML = ''
    validate()
    if(checkValidate === true){
        createElement()
    }
})

btnMark.addEventListener('click',(e)=>{
    inputBox.innerHTML = ''
    const clickedElement = e.target
    const outline = document.querySelectorAll('.box .is-active.outline')
    const greenTextElements = document.querySelectorAll('.box .is-active.text-green')

    if(outline.length > 1){
        let warningText = document.createElement('p')
        warningText.textContent = 'Bara ett text åt gången!'
        warningText.classList.add('warning-text')
        inputBox.appendChild(warningText)
        return
    }

    if(outline.length > 0 && togglePut === false){
        outline[0].classList.remove('text-red')
        outline[0].classList.add('text-green')
        togglePut = true 
        putData(outline[0].getAttribute('id'),togglePut)
    }
    if(greenTextElements.length > 0){
        greenTextElements[0].classList.remove('text-green')
        greenTextElements[0].classList.add('text-red')
        togglePut = false
        putData(greenTextElements[0].getAttribute('id'),togglePut)
    }


})

btnDelete.addEventListener('click',()=>{
    inputBox.innerHTML = ''
    const greenTextElements = document.querySelectorAll('.box .is-active.text-green')
    const redTextElements = document.querySelectorAll('.box .is-active.text-red')
    
    if(greenTextElements.length > 1){
        return
    }

    if(redTextElements.length > 0){
        popupModal()
    }

    if(greenTextElements.length > 0){
      deleteData(greenTextElements[0].getAttribute('id'))
      }
      return
    }
)

// Denna eventlistner är bara för att preventa submit funktionen/preventdefault
form.addEventListener('submit',(e)=>{
    e.preventDefault()
})

//Popup som förhindrar användaren att ta bort rödmarkerad objekt
function popupModal(){
    const overlayElement = document.createElement('div')
    const modalElement = document.createElement('div')
    const xMarkElement = document.createElement('i')
    const pElement = document.createElement('p')
    overlayElement.classList.add('overlay')
    modalElement.classList.add('modal')
    xMarkElement.classList.add('fa-solid')
    pElement.classList.add('modal-text')
    pElement.textContent = 'Varning! Grön markera Todon för att kunna ta bort.'
    
    modalElement.addEventListener('click',(e)=>{
        e.stopPropagation();
    })

    overlayElement.addEventListener('click',()=>{
        overlayElement.style.display = 'none'
    })

    modalElement.append(pElement)
    overlayElement.appendChild(modalElement)
    wrapper.appendChild(overlayElement)
}

//fetch delete
async function deleteData(id){
      
try {
        const response = await fetch(`https://js1-todo-api.vercel.app/api/todos/${id}?apikey=af3092f0-c8c2-479b-83c3-a76ecb766e94`,{
           method:'DELETE',
       })
       
       if(!response.ok){
        throw new Error('Something went wrong' + response.status)
        }
    const data = await response.json()   
    posts = posts.filter(user => user._id !== data)
    
    displayData()
      
    } catch (error) {
        console.error(error.message)
    }
    
    }

//skickar data    
async function putData(id,trueOrFalse){
let checkIfCompleted = {
    completed:trueOrFalse
}

    try {
        const response = await fetch(`https://js1-todo-api.vercel.app/api/todos/${id}?apikey=af3092f0-c8c2-479b-83c3-a76ecb766e94`,{
            method:'PUT',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify(checkIfCompleted)
        })        

        if(!response.ok){
            throw new Error('Something went wrong' + response.status)
        }
        const data = await response.json()
        console.log(data)
    } catch (error) {
        console.error(error.message)
    }

}

//skapar ett element från input fältet
function createElement(){
    let input1 = document.querySelector('.first-input').value
    writeField.value = ''
    addPost(input1)
}


function displayPostData(data){


    let pElement = document.createElement('p')
    pElement.textContent = data.title
    pElement.classList.add('is-active')
    pElement.setAttribute("id",data._id)
    pElement.addEventListener('click',()=>{
        pElement.classList.toggle('outline')

    })
    box.appendChild(pElement)
    
}

//validerar ifall du inte har fyllt i 
function validate(){

    if(writeField.value.trim() === ''){
      let error = document.createElement('p')
      error.classList.add('error')
      error.textContent = 'Du har glömt att skriva!'
      inputBox.appendChild(error)
      console.log('Error')
        return checkValidate = false
  }else if(writeField.value.length <= 2){
      let error = document.createElement('p')
      error.classList.add('error')
      error.textContent = 'Minst 2 bokstäver!'
      inputBox.appendChild(error)
      console.log('Kort')
        return checkValidate = false
     }
     return checkValidate = true
}
