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
        "kelyton",
        "rick",
        "everton",
        "rafael"
    ];
    // Verifica a senha exatamente como digitada (case sensitive)
    return senhasValidas.includes(senha);
};