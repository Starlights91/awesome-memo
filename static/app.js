//메모 수정
async function editMemo(event) {
  const id = event.target.dataset.id;
  // console.log(event.target.dataset.id); //어떤 버튼이 눌렸는지, event에 target이라는 속성이 있고, dataset.id가 출력되는것을 볼 수 있다. 그래서 const id = 넣어주고 console.log는 지운다.
  const editInput = prompt("수정할 값을 입력하세요~!"); //바꿀 요청을 만들. WebAPI 사용. 수정된 editInput값은 prompt라는 함수를 이용해서 팝업되도록 하는것.
  // console.log(editInput); //이 값을 받았으니까, 서버로 요청을 보낼것..
  const res = await fetch(`/memos/${id}`, {
    method: "PUT", //어떤 값을 수정할 때는 method: "PUT", 쓰면 좋다. (PUT이라는 method는 특정 값이 있을 때, 이 값으로 바꿔줘라고 하는 것.)
    headers: {
      "Content-Type": "application/json", //"Content-Type": "application/json", 컨텐츠 타입으로 넣어서
    },
    body: JSON.stringify({
      id, //.toString(), 넣으니까 오류 해결. JS에서 id는 id의 경우, id:id 또는 id 로 생략해도 id는 id가 들어간다.
      content: editInput,
    }),
  }); //const response를 받는데 away-fetch() 사용해서 서버의 메모에 backtick 안에 이 id값을 요청을 보낼건데, await쓰려면 function 앞에 꼭 async 추가해줘야 한다.
  readMemo(); //제대로 업데이트 되었는지 확인하기 위해 readMemo();
}

//메모 삭제
async function deleteMemo(event) {
  const id = event.target.dataset.id;
  const res = await fetch(`/memos/${id}`, {
    method: "DELETE", // `/memos/${id}`, {   memos의 특정 id의 값을 지울 때, method: "DELETE", 사용해서 보내주는 것.
  });
  readMemo();
}

//메모 표시
function displayMemo(memo) {
  const ul = document.querySelector("#memo-ul");

  const li = document.createElement("li");
  li.innerText = `[id=${memo.id}] ${memo.content}`;

  const editBtn = document.createElement("button"); //버튼만들기
  editBtn.innerText = "수정하기"; //버튼안에는 수정하기 라는 텍스트 넣고
  editBtn.addEventListener("click", editMemo); // 버튼에는 이벤트를 달아주고, editMemo 호출, 특정 메모의 값을 바꾸려면 특정 메모가 id가 몇번인지 알아야함.
  editBtn.dataset.id = memo.id; //그래서 editBtn에 data로 넣어준다. data.dataset.id해서 에 넣어준다. 내가 알고 있는 memo.id값을 dataset에 넣어준다. 정리: dataset이라는 속성에 .id라는 값에 memo.id를 넣어줄것이다. 예)wordle할 때 처럼, html에서 data-id이고 <div data-id="00"></div> -> JS에선 dataset.id

  const delBtn = document.createElement("button");
  delBtn.innerText = "삭제";
  delBtn.addEventListener("click", deleteMemo);
  delBtn.dataset.id = memo.id;

  li.appendChild(editBtn); //edtBtn 버튼이 보이도록 appendChild 해줘야 함. ul에다가 하면, 글자바로 밑 하단에 "수정하기" 버튼이 생성되고, li에다가 하면, 글자 바로 옆에 "수정하기" 버튼이 생성.
  li.appendChild(delBtn); //delBtn 버튼이 보이도록
  ul.appendChild(li);
}

async function readMemo() {
  const res = await fetch("/memos"); //get 요청
  const jsonRes = await res.json();
  const ul = document.querySelector("#memo-ul");
  ul.innerHTML = "";
  jsonRes.forEach(displayMemo);
}

async function createMemo(value) {
  const res = await fetch("/memos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: new Date().getTime().toString(), //.toString(), 넣으니까 오류 해결.
      content: value,
    }),
  });
  readMemo();
}

function handleSubmit(event) {
  event.preventDefault();
  const input = document.querySelector("#memo-input");
  createMemo(input.value);
  input.value = "";
}

const form = document.querySelector("#memo-form");
form.addEventListener("submit", handleSubmit);

readMemo();
