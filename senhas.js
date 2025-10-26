// senhas.js - Nova versão corrigida
window.verificarSenha = function(senha) {
    const senhasValidas = [
        "tainara",
        "rick",
        "013179",
        "Bry@2000",//1do11de2025
        "1537"//10do11de2025
];
    // Verifica a senha exatamente como digitada (case sensitive)
    return senhasValidas.includes(senha);
};