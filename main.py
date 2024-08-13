from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

class Memo(BaseModel):
    id:str
    content:str
     
memos = []    
    
app = FastAPI()

@app.post("/memos")
def create_memo(memo:Memo):
    memos.append(memo)
    return '메모 추가에 성공했습니다!'

@app.get("/memos")
def read_memo():
    return memos

@app.put("/memos/{memo_id}")
def put_memo(req_memo:Memo):
    for memo in memos:
        if memo.id==req_memo.id: # memo.id가 req_memo의 id랑 같을 때,
            memo.content=req_memo.content #기존에 있는 memo.content (memo의 콘텐츠)를 request로 온 req_memo.content(req_memo의 콘텐츠)로 바꿔라.
            return '성공했습니다.'
    return '그런 메모는 없습니다.'

@app.delete("/memos/{memo_id}")
def delete_memo(memo_id):
    for index,memo in enumerate (memos):  #for문에 index와 enumerate 같이 쓰는 함수 (코딩테스트에서 많이 다룸). 이 배열에 idex와 값을 같이 뽑아주는 함수.
        if memo.id==memo_id: # memo.id가 memo_id랑 같을 때,
            memos.pop(index) #pop 없앤다는 의미
            return '성공했습니다.'
    return '그런 메모는 없습니다.'

app.mount("/", StaticFiles(directory='static', html=True), name='static')