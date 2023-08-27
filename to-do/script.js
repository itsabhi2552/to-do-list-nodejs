var id = 0;
const form = document.getElementById("form");

fetchData();

function fetchData() {
    var request = new XMLHttpRequest();
    request.open("GET", "/fetch");
    request.send();

    request.addEventListener("load", () => {
        task_arr = JSON.parse(request.responseText);
        for (let i = 0; i < task_arr.length; i++) {
            if(task_arr[i]) {
                createTask(id, task_arr[i].task, task_arr[i].checked, task_arr[i].image);
            }
            id++;
        }
    });
}

function createRow(id, cls = "row") {
    var row = document.createElement("div");
    row.setAttribute("class", cls);
    row.setAttribute("id", id);
    row.style.borderBottom = "1px solid rgb(185, 185, 185)";
    return row;
}

function createCol(cls = "col") {
    var col = document.createElement("div");
    col.setAttribute("class", cls);
    return col;
}

function createImage(img) {
    var image = document.createElement("img");
    image.setAttribute("style", "height: 30px; width: 30px;");
    image.setAttribute("src", `${img}`)
    return image;
}

function createCheckbox(checked_flag) {
    var check_box = document.createElement("input");
    check_box.setAttribute("type", "checkbox");
    check_box.checked = checked_flag;

    check_box.addEventListener("click", (event) => {
        let index = event.target.parentNode.parentNode.parentNode.id;
        var request = new XMLHttpRequest();
        request.open("post", '/check');
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({ index: index }));

        request.addEventListener('load', () => {
            if (request.status === 200) {
                if(JSON.parse(request.responseText).flag) {
                    document.getElementById(index).firstChild.firstChild.setAttribute("style", "text-decoration: line-through");
                } else {
                    document.getElementById(index).firstChild.firstChild.setAttribute("style", "text-decoration: none");
                }
            }
        });
    });

    return check_box;
}

function createCross() {
    var cross = document.createElement("span");
    cross.setAttribute("class", "fa fa-close");

    cross.addEventListener("click", (event) => {
        let index = event.target.parentNode.parentNode.parentNode.id;
        var request = new XMLHttpRequest();
        request.open("post", '/dlt');
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({ index }));

        request.addEventListener('load', () => {
            if (request.status === 200) {
                event.target.parentNode.parentNode.parentNode.remove();
            }
        });
    });

    return cross;
}

function createIcon(img, checked_flag) {
    var icon = document.createElement("div");

    var pencil = createImage(img);
    var check_box = createCheckbox(checked_flag);
    var cross = createCross();

    icon.setAttribute("class", "d-flex justify-content-around align-items-center");

    icon.appendChild(pencil);
    icon.appendChild(check_box);
    icon.appendChild(cross);

    return icon;
}

function createTask(id, task, checked_flag, img) {
    var task_container = document.getElementById("task-container");
    var new_task = document.createElement("div");
    var row = createRow(id);
    var col1 = createCol("col-9 p-3");
    var col2 = createCol("col-3 p-3");
    var icon = createIcon(img, checked_flag);

    new_task.style.overflowWrap = "break-word";
    new_task.innerText = task;

    col1.appendChild(new_task);
    col2.appendChild(icon);
    row.appendChild(col1);
    row.appendChild(col2);

    task_container.appendChild(row);

    if(checked_flag) {
        document.getElementById(id).firstChild.firstChild.setAttribute("style", "text-decoration: line-through");
    } else {
        document.getElementById(id).firstChild.firstChild.setAttribute("style", "text-decoration: none");
    }
}

function checkError() {
    const task = document.getElementById("input").value;
    if (task !== "") {
        for (let i = 0; i < task.length; i++) {
            if (task[i] !== " ") {
                return false;
            }
        }
    }
    return true;
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!checkError()) {
        var formData = new FormData(form);
        var request = new XMLHttpRequest();
        request.open('post', '/store');
        request.send(formData);
        request.addEventListener('load', () => {
            form.reset();
            var response = JSON.parse(request.responseText);
            createTask(id++, response.task, response.checked, response.image);
        });
    }
});
