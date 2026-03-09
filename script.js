let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks(){
localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayTasks(){

let list = document.getElementById("taskList");
list.innerHTML = "";

tasks.forEach((task,index)=>{

let li = document.createElement("li");

let span = document.createElement("span");
span.textContent = task.text;

if(task.done){
span.style.textDecoration = "line-through";
}

span.onclick = function(){
tasks[index].done = !tasks[index].done;
saveTasks();
displayTasks();
};

let deleteBtn = document.createElement("button");
deleteBtn.textContent = "❌";

deleteBtn.onclick = function(){
tasks.splice(index,1);
saveTasks();
displayTasks();
};

li.appendChild(span);
li.appendChild(deleteBtn);

list.appendChild(li);

});

}

function addTask(){

let input = document.getElementById("taskInput");
let text = input.value.trim();

if(text === "") return;

tasks.push({
text:text,
done:false
});

saveTasks();

input.value = "";

displayTasks();
}

displayTasks();