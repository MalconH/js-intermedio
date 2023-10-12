const URL = "localhost:5500/clase-12/tarea/clase-12/tarea-1/index.html";
// A la fecha donde se escribió este código, la API devolvía 31 tipos de cambio.
const MONEDAS_DISPONIBLES = 32;

describe("Comprobaciones de interfaz", () => {
    beforeEach(() => {
        cy.visit(URL);
    });

    it("Los inputs son visibles y están correctos", () => {
        cy.get("#fecha[type='date']");
        cy.get("#moneda").children()
            .should("have.length", MONEDAS_DISPONIBLES);
        cy.get("#enviar");
    });

    it("Deja ingresar correctamente los datos", () => {
        cy.get("#fecha").type("2004-12-10");
        cy.get("#moneda")
            .select(0)
            .select("BRL")
            .select("CZK")
            .select("USD")
            .select("EUR");
    });

    it("Los tipos de cambio están ocultos al cargar la web", () => {
        cy.get(".tipos-de-cambio").should("not.be.visible");
    });
});

describe("Comprobaciones de la funcionalidad", () => {
    const FECHA = "2022-12-09";
    const FECHA_FORMATEADA = "09-12-2022";
    const MONEDA = "BRL";


    beforeEach(() => {
        cy.visit(URL);
    });

    it("No hace nada al dejar uno o ambos campos vacíos", () => {
        cy.get("#enviar").click();

        cy.get("#fecha").type("2002-10-05");
        cy.get("#enviar").click();

        cy.get("#fecha").clear();
        cy.get("#moneda").select("USD");
        cy.get("#enviar").click();

        cy.get(".tipos-de-cambio").should("not.be.visible");
        cy.get(".tipo-de-cambio").should("not.exist");
    });

    it("Procesa correctamente los datos enviados y muestra los tipos de cambio", () => {
        // Habrá casos donde la fecha que devuelva la API no será la misma que ingresamos. Esto es cuando:
        // 1. Se ingresó una fecha correspondiente a un día de cierre
        // 2. Se ingresó una fecha correspondiente a un sabado/domingo

        cy.get("#fecha").type(FECHA);
        cy.get("#moneda").select(MONEDA);
        cy.get("#enviar").click();

        cy.get(".tipos-de-cambio__titulo")
            .should("have.text", `Los tipos de cambio del ${MONEDA} para el ${FECHA_FORMATEADA} son: `);

        cy.get(".tipo-de-cambio")
            .should("have.length", MONEDAS_DISPONIBLES - 1); // Menos la moneda base, que no la devuelve la API
    });

    it("Los tipos de cambio se muestran correctamente al re-enviar el formulario", () => {
        cy.get("#fecha").type(FECHA);
        cy.get("#moneda").select(MONEDA);
        cy.get("#enviar").click();

        cy.get("#fecha").type("2022-12-08");
        cy.get("#moneda").select("EUR");
        cy.get("#enviar").click();

        cy.get(".tipos-de-cambio__titulo")
            .should("have.text", `Los tipos de cambio del EUR para el 08-12-2022 son: `);

        cy.get(".tipo-de-cambio").should("have.length", 31);
    });
});
