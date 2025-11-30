(() => {
  'use strict'
  const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.forEach(tooltipTriggerEl => {
    new bootstrap.Tooltip(tooltipTriggerEl)
  })
})()//NÃO MEXER AQUI, CÓDIGO DO BOOTSTRAP PARA JS


document.addEventListener('DOMContentLoaded', function () {

  
  const logoutButton = document.getElementById('logout-link');
  if(logoutButton) { 
    logoutButton.addEventListener('click', function (event) {
      event.preventDefault();
      localStorage.removeItem('usuarioLogado');
      window.location.href = '../login/login.html';
    });// CÓDIGO DE LOGOUT
  }

  // --- SEÇÃO DE NAVEGAÇÃO DA SIDEBAR ---

  const links = {
    home: document.getElementById('home-link'),
    emprestimos: document.getElementById('emprestimos-link'),
    clientes: document.getElementById('clientes-link'),
  };
  const contents = {
    home: document.getElementById('home-content'),
    emprestimos: document.getElementById('emprestimos-content'),
  };

  const showContent = (contentKey) => {
    Object.values(contents).forEach(content => content.classList.add('d-none'));
    Object.values(links).forEach(link => link.classList.remove('active'));
    contents[contentKey].classList.remove('d-none');
    links[contentKey].classList.add('active');
  };

  links.home.addEventListener('click', (e) => { e.preventDefault(); showContent('home'); });
  links.emprestimos.addEventListener('click', (e) => { e.preventDefault(); showContent('emprestimos'); });

  // --- LÓGICA DO CRUD DE EMPRÉSTIMOS ---
  
  const loanForm = document.getElementById('loanForm');
  const loanTableBody = document.getElementById('loan-table-body');
  const loanModal = new bootstrap.Modal(document.getElementById('loanModal'));
  const loanModalLabel = document.getElementById('loanModalLabel');

  
  
  const saveLoansToLocalStorage = (loansData) => {
    localStorage.setItem('savedLoans', JSON.stringify(loansData));
  };// --- LÓGICA DO LOCALSTORAGE PARA PERSISTÊNCIA DE DADOS ---

  const loadLoansFromLocalStorage = () => {
    const savedLoans = localStorage.getItem('savedLoans');
    if (savedLoans) {
      return JSON.parse(savedLoans);
    } else {
      return [
        { id: 1, credor: 'Banco Principal S/A', valor: 50000, juros: 1.8, prazo: 36, vencimento: '2026-12-15' },
        { id: 2, credor: 'Financeira Invest', valor: 120000, juros: 2.1, prazo: 48, vencimento: '2028-01-10' },
      ];
    }
  };

  let loans = loadLoansFromLocalStorage();

  const renderTable = () => {
    loanTableBody.innerHTML = '';
    loans.forEach(loan => {
      const row = `
        <tr>
          <td>${loan.id}</td>
          <td>${loan.credor}</td>
          <td>${loan.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
          <td>${loan.juros}% a.m.</td>
          <td>${loan.prazo} meses</td>
          <td>${new Date(loan.vencimento + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
          <td>
            <button class="btn btn-sm btn-primary edit-btn" data-id="${loan.id}">Editar</button>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${loan.id}">Apagar</button>
          </td>
        </tr>
      `;
      loanTableBody.innerHTML += row;
    });
  };

  loanForm.addEventListener('submit', (e) => {
    e.preventDefault();

    
    const vencimentoValue = document.getElementById('vencimento').value;
    const inputDate = new Date(vencimentoValue + 'T00:00:00'); 
    const inputYear = inputDate.getFullYear();
    const currentYear = new Date().getFullYear();

    
    if (isNaN(inputDate.getTime()) || inputYear > currentYear + 1000) {
      alert(`O ano de vencimento não pode ser posterior a ${currentYear + 1000}. Por favor, insira uma data válida.`);
      return; // Verifica se a data inserida é válida e se o ano está no limite de 1000 anos
    }
    

    const id = document.getElementById('loanId').value;
    const newLoanData = {
      credor: document.getElementById('credor').value,
      valor: parseFloat(document.getElementById('valor').value),
      juros: parseFloat(document.getElementById('juros').value),
      prazo: parseInt(document.getElementById('prazo').value),
      vencimento: vencimentoValue,
    };

    if (id) {
      const index = loans.findIndex(loan => loan.id == id);
      loans[index] = { id: parseInt(id), ...newLoanData };
    } else {
      newLoanData.id = loans.length > 0 ? Math.max(...loans.map(l => l.id)) + 1 : 1;
      loans.push(newLoanData);
    }
    
    saveLoansToLocalStorage(loans); 
    renderTable();
    loanModal.hide();
  });

  loanTableBody.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('delete-btn')) {
      const id = target.getAttribute('data-id');
      if (confirm('Tem certeza que deseja apagar este empréstimo?')) {
        loans = loans.filter(loan => loan.id != id);
        saveLoansToLocalStorage(loans); 
        renderTable();
      }
    }
    
    if (target.classList.contains('edit-btn')) {
      const id = target.getAttribute('data-id');
      const loan = loans.find(l => l.id == id);
      
      loanModalLabel.textContent = 'Editar Empréstimo';
      document.getElementById('loanId').value = loan.id;
      document.getElementById('credor').value = loan.credor;
      document.getElementById('valor').value = loan.valor;
      document.getElementById('juros').value = loan.juros;
      document.getElementById('prazo').value = loan.prazo;
      document.getElementById('vencimento').value = loan.vencimento;
      
      loanModal.show();
    }
  });
  
  
  document.getElementById('loanModal').addEventListener('show.bs.modal', (event) => {
      if (!event.relatedTarget || event.relatedTarget.textContent.includes('Adicionar')) {
          loanModalLabel.textContent = 'Adicionar Novo Empréstimo';
          loanForm.reset();
          document.getElementById('loanId').value = '';// Limpa o formulário ao abrir para Adicionar
      }
  });

  // Renderiza a tabela pela primeira vez com os dados carregados
  renderTable();

}); 
