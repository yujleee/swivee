// 페이지 스크롤
const toTop = document.querySelector('.toTop');

window.addEventListener('scroll', checkHeight);

function checkHeight() {
  if (window.scrollY > 10) {
    toTop.classList.add('active');
  } else {
    toTop.classList.remove('active');
  }
}

toTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});
