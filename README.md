Mobsite 1/2 Ray
=======
## StartActivity :
- 新增```getProjectNames()```，呼叫時會回傳一個```Vector<String>```，內有使用者的專案名稱們。
- 新增```newProject(String name)```，傳入新專案名稱，建立新專案。呼叫此函數時，如果專案名稱有重複，則不會建立新專案
，且回傳```false```。若順利建立，則回傳```true```。
- 新增```copyInitFile(String from, File to)```，```newProject()```的輔助函式。
- ```Testbtn_Listener```中的```onClick()```，在```edit```這個```Intent```物件增加了一個```Bundle```
，把使用者選擇的專案名稱傳給```MainActivity```。

Note：請記得利用```newProject(String name)```的回傳值，讓使用者的輸入內容被控制。

## MainActivity：
- 新增```onActivityResult```中處理匯入圖片的函式。
- 新增```@JavascriptInterface```函數```getProjectPath()```，讓WebView的javascript函式可以呼叫，並得到專案的網頁資料夾。
(但不清楚WebView能否擁有存取此檔案的權限。)
- 新增```@JavascriptInterface```函數```openPhotoDialog()```，存取android的相片。
- 新增```@JavascriptInterface```函數```getProjectsPathAndContentJSON()```，讓WebView要同步到GitHub時能夠存取檔案。

##  assets/資料夾下新增init資料夾，存放新增專案時，基本的index.html、css、js資料夾，如此可以作為樣板，直接複製新專案。
