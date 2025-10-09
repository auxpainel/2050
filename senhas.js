// senhas.js - Nova versão corrigida
window.verificarSenha = function(senha) {
    const senhasValidas = [
        "tainara",
        "rick",
        "FLASH1K_" //19/10/2025 flash404 discord
        
    ];
    // Verifica a senha exatamente como digitada (case sensitive)
    return senhasValidas.includes(senha);
};