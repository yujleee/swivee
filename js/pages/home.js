export const toggleMoreBrand = (event) => {
  event.preventDefault();
  const btnMoreBrand = document.querySelector('.btnMoreBrand');
  const AllBrandItems = document.querySelectorAll('.brandItem');

  if (btnMoreBrand.classList.contains('fa-chevron-down')) {
    AllBrandItems.forEach((item) => {
      if (item.classList.contains('hide')) {
        item.classList.toggle('hide');
      }
    });
  } else {
    AllBrandItems.forEach((item) => {
      if (!item.classList.contains('show')) {
        item.classList.toggle('hide');
      }
    });
  }

  btnMoreBrand.classList.toggle('fa-chevron-down');
  btnMoreBrand.classList.toggle('fa-chevron-up');
};
