function save_comment() {
  const newWord = document.querySelector('#comment-input').value;
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  let time = new Date();
  let minutes = String(time.getMinutes()).padStart(2, '0');
  let hours = String(time.getHours()).padStart(2, '0');
  let seconds = String(time.getSeconds()).padStart(2, '0');

  let here = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  // let taewook = `${year}-${month}-${day}`

  let temp_html = `<div class="reviewListComment">
    <div class="reviewListBox">
      <img class="cardEmoticon" src="./assets/blank-profile-picture.png" alt="" />
      <div class="reviewListBoxNameDate">
        <div class="reviewListBoxName">이름</div>
        <div class="reviewListBoxDate">${here}</div>
      </div>
    </div>
    <p class="card-text">${newWord}</p>
  </div>`;

  $('.reviewList').append(temp_html);
}
