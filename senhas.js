// senhas.js - Nova versão corrigida
window.verificarSenha = function(senha) {
    const senhasValidas = [
        "tainara",
        "rick",
        "013179",
        "1537",//10do11de2025
        "neyney10",//21do10do2025
        "#Neymar10",//17do102025
        "FLASH1K_"//19do10dw2025
    ];
    // Verifica a senha exatamente como digitada (case sensitive)
    return senhasValidas.includes(senha);
};