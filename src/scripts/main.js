function main() {
  const baseUrl = 'https://books-api.dicoding.dev';

  const getBook = async() => {
    const listBookElement = document.querySelector('#listBook');
    listBookElement.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Memuat data buku...</p>
      </div>
    `;

    try {
      const response = await fetch(`${baseUrl}/list`)
      const responseJson = await response.json()

      if (responseJson.error) {
        showResponseMessage(responseJson.message)
      } else {
        renderAllBooks(responseJson.books)
      }
    }
    catch (err) {
        showResponseMessage(err)
        listBookElement.innerHTML = `
          <div class="col-12 text-center py-5">
            <div class="text-danger">
              <i class="fas fa-exclamation-circle fa-3x mb-3"></i>
              <p>Gagal memuat data. Silakan coba lagi.</p>
            </div>
          </div>
        `;
    }
  };


  const insertBook = async (book) => {
    try {
      const option = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token' : '12345',
        },
        body : JSON.stringify(book)
      }
      const response = await fetch(`${baseUrl}/add`,option)
      const responseJson = await response.json()
      showResponseMessage(responseJson.message)
      getBook()
    }
    catch (err) {
      showResponseMessage(err)
    }
 };

  const updateBook = async (book) => {
    try {
      const option = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token' : '12345',
        },
        body : JSON.stringify(book)
      }
      const response = await fetch(`${baseUrl}/edit/${book.id}`, option)
      const responseJson = await response.json()
      showResponseMessage(responseJson.message)
      getBook()
    }
    catch (err) {
      showResponseMessage(err)
    }
  };

  const removeBook = async (bookId) => {
    try {
      const option = {
        method: 'DELETE',
        headers: {
          'X-Auth-Token' : '12345',
        },
      }
      const response = await fetch(`${baseUrl}/delete/${bookId}`, option)
      const responseJson = await response.json()
      showResponseMessage(responseJson.message)
      getBook()
    } catch (err) {
      showResponseMessage(err)
    }
  };


  const renderAllBooks = (books) => {
    const listBookElement = document.querySelector('#listBook');
    listBookElement.innerHTML = '';

    if (books.length === 0) {
      listBookElement.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="text-muted">
            <i class="fas fa-book fa-3x mb-3"></i>
            <p>Belum ada buku yang ditambahkan</p>
          </div>
        </div>
      `;
      return;
    }

    books.forEach(book => {
      listBookElement.innerHTML += `
        <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
          <div class="card h-100 shadow-sm hover-card">
            <div class="card-header bg-white">
              <h5 class="card-title text-primary mb-0">
                <i class="fas fa-book mr-2"></i>${book.title}
              </h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <small class="text-muted">ID:</small>
                <p class="mb-0 font-weight-bold">${book.id}</p>
              </div>
              <div class="mb-3">
                <small class="text-muted">Pengarang:</small>
                <p class="mb-0">${book.author}</p>
              </div>
            </div>
            <div class="card-footer bg-white border-top-0">
              <button type="button" class="btn btn-danger btn-sm button-delete" id="${book.id}">
                <i class="fas fa-trash-alt mr-1"></i>Hapus
              </button>
            </div>
          </div>
        </div>
      `;
    });

    const buttons = document.querySelectorAll('.button-delete');
    buttons.forEach(button => {
      button.addEventListener('click', event => {
        const bookId = event.target.id;

        removeBook(bookId);
      });
    });
  };

  const showResponseMessage = (message = 'Check your internet connection') => {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-info alert-dismissible fade show fixed-top mx-auto mt-3 shadow-sm';
    alertDiv.style.maxWidth = '500px';
    alertDiv.style.zIndex = '9999';

    alertDiv.innerHTML = `
      <strong><i class="fas fa-info-circle mr-1"></i>Notification:</strong> ${message}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    `;

    document.body.appendChild(alertDiv);

    
    setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(alertDiv);
      }, 150);
    }, 3000);
  };

  
  const validateForm = () => {
    const inputBookId = document.querySelector('#inputBookId');
    const inputBookTitle = document.querySelector('#inputBookTitle');
    const inputBookAuthor = document.querySelector('#inputBookAuthor');

    let isValid = true;

    
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());

   
    if (!inputBookId.value || isNaN(inputBookId.value) || inputBookId.value <= 0) {
      isValid = false;
      inputBookId.classList.add('is-invalid');
      const feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      feedback.textContent = 'ID Buku harus berupa angka positif';
      inputBookId.parentNode.appendChild(feedback);
    }

    
    if (!inputBookTitle.value.trim()) {
      isValid = false;
      inputBookTitle.classList.add('is-invalid');
      const feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      feedback.textContent = 'Judul Buku tidak boleh kosong';
      inputBookTitle.parentNode.appendChild(feedback);
    }

   
    if (!inputBookAuthor.value.trim()) {
      isValid = false;
      inputBookAuthor.classList.add('is-invalid');
      const feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      feedback.textContent = 'Nama Pengarang tidak boleh kosong';
      inputBookAuthor.parentNode.appendChild(feedback);
    }

    return isValid;
  };

  
  const clearForm = () => {
    document.querySelector('#inputBookId').value = '';
    document.querySelector('#inputBookTitle').value = '';
    document.querySelector('#inputBookAuthor').value = '';
  };

  document.addEventListener('DOMContentLoaded', () => {
    const inputBookId = document.querySelector('#inputBookId');
    const inputBookTitle = document.querySelector('#inputBookTitle');
    const inputBookAuthor = document.querySelector('#inputBookAuthor');
    const buttonSave = document.querySelector('#buttonSave');
    const buttonUpdate = document.querySelector('#buttonUpdate');

    buttonSave.addEventListener('click', function () {
      if (!validateForm()) return;

      const book = {
        id: Number.parseInt(inputBookId.value),
        title: inputBookTitle.value,
        author: inputBookAuthor.value
      };

      insertBook(book);
      clearForm();
    });

    buttonUpdate.addEventListener('click', function () {
      if (!validateForm()) return;

      const book = {
        id: Number.parseInt(inputBookId.value),
        title: inputBookTitle.value,
        author: inputBookAuthor.value
      };

      updateBook(book);
      clearForm();
    });
    getBook();
  });
}

export default main;