document.addEventListener('DOMContentLoaded', () => {
    // 1. Roteamento Simples (SPA) baseado na Sidebar
    const navButtons = document.querySelectorAll('.nav-menu .nav-btn');
    const sections = document.querySelectorAll('.view-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Se clicar em Riscos, direciona para o Dashboard (Visão Geral unificada)
            let targetId = e.target.getAttribute('data-target');
            if(targetId === 'riscos') targetId = 'dashboard';

            // Atualiza botões
            navButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Atualiza Telas
            sections.forEach(sec => sec.classList.add('hidden'));
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
            }

            // Se voltar para CAT principal, garante que o detalhe esteja fechado
            if(targetId === 'cat') fecharCATDetalhe();
        });
    });
});

// 2. Hub de Conexões: Fluxo "One-Click"
function conectarApp(card, nomeApp) {
    const btn = card.querySelector('.btn-connect');
    if (btn.classList.contains('connected')) return;

    btn.innerText = `⏳ Autenticando API...`;
    card.style.opacity = '0.7';

    setTimeout(() => {
        btn.classList.add('connected');
        btn.innerText = `✅ Conectado`;
        card.style.opacity = '1';
        card.style.borderColor = '#4caf50';
    }, 1500); // Simulando o tempo de loading
}

// 3. Central de Atendimento (CAT) - Navegação Mestre/Detalhe
function abrirCATDetalhe() {
    document.getElementById('clients-list').classList.add('hidden');
    document.querySelector('.search-container').classList.add('hidden');
    document.getElementById('cat-detail').classList.remove('hidden');
    
    // Reseta estado da purga caso o usuário volte
    document.getElementById('receipt-area').classList.add('hidden');
    const indicators = document.querySelectorAll('.status-indicator');
    indicators.forEach(ind => {
        ind.className = 'status-indicator pending';
        ind.innerText = 'Pendente';
    });
}

function fecharCATDetalhe() {
    document.getElementById('cat-detail').classList.add('hidden');
    document.getElementById('clients-list').classList.remove('hidden');
    document.querySelector('.search-container').classList.remove('hidden');
}

function buscarTitular() {
    const termo = document.getElementById('cat-search').value;
    if(!termo) {
        alert("Digite um CPF ou E-mail para buscar nas bases integradas.");
        return;
    }
    // Mágica para o lojista: simula busca rápida pulando direto pro detalhe
    abrirCATDetalhe();
    document.getElementById('detail-name').innerText = `Resultado para: ${termo}`;
}

// 4. Ação Principal: Purga Unificada (One-Click Delete)
function executarPurga() {
    const confirmar = confirm("Isso acionará a API de todos os sistemas conectados para deletar os dados deste usuário permanentemente. Deseja prosseguir?");
    
    if (!confirmar) return;

    const btn = document.querySelector('.btn-danger-large');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ EXECUTANDO PURGA...';
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.8';

    const plataformas = document.querySelectorAll('#data-locations li');
    let delay = 0;

    // Efeito cascata deletando um por um visualmente
    plataformas.forEach((plat, index) => {
        setTimeout(() => {
            const status = plat.querySelector('.status-indicator');
            status.innerText = "Excluindo...";
            
            setTimeout(() => {
                status.className = 'status-indicator purged';
                status.innerText = "✅ Deletado";
                
                // Se for o último, finaliza o processo
                if (index === plataformas.length - 1) {
                    btn.innerHTML = originalText;
                    btn.style.pointerEvents = 'auto';
                    btn.style.opacity = '1';
                    btn.style.display = 'none'; // Esconde o botão após sucesso
                    
                    document.getElementById('receipt-area').classList.remove('hidden');
                    inserirEvidenciaESG(); // Popula o relatório ESG automaticamente
                }
            }, 600);
        }, delay);
        delay += 800;
    });
}

// 5. Relatórios e ESG
function baixarPDF() {
    alert("Iniciando o download do recibo criptografado (PDF) contendo os logs da operação para fins de conformidade com a ANPD.");
}

function gerarRelatorioESG() {
    alert("Compilando dados de governança (Pilar G)... O download do Relatório Executivo começará em instantes.");
}

function inserirEvidenciaESG() {
    const tbody = document.getElementById('esg-history');
    const tr = document.createElement('tr');
    const hoje = new Date().toLocaleDateString('pt-BR');
    
    tr.innerHTML = `
        <td>${hoje}</td>
        <td>***.***.***-**</td>
        <td>WhatsApp, Shopify, Bling, RD Station</td>
        <td><span class="badge-success">Certificado</span></td>
    `;
    tbody.prepend(tr);
}