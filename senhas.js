// senhas.js - Nova versão corrigida
window.verificarSenha = function(senha) {
    const senhasValidas = [
        "admin",
        "Teste24",
        "adm",
        "tainara",
        "vitor",
        "pablo",
        "testegratis",
        "gatos3D",
        "rick",
        "gatI2",
        "rafael"
    ];
    // Verifica a senha exatamente como digitada (case sensitive)
    return senhasValidas.includes(senha);
};