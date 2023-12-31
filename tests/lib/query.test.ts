import { Board } from "@google-labs/breadboard";
import WeaviateKit from "../../src/index";
import { WeaviateTestManager } from "../testUtils";

const weaviateTestManager = new WeaviateTestManager();

beforeEach(async () => {
    await weaviateTestManager.deployWeaviate();

});

afterEach(async () => {

    if (weaviateTestManager.environment) {
        await weaviateTestManager.environment.down();
    }
});

describe("query node tests", () => {
    test("search Harry Potter using vector search", async () => {
        const inputs = {
            weaviateHost: "localhost:8080",
            query: `
                a novice sorcerer uncovering his mystical lineage 
                while confronting adversities in his inaugural year 
                at an enchanted institution.
            `,
            alpha: 1,
            className: "Book",
            fields: "title summary"
        };

        const expectedTitle = "Harry Potter and the Sorcerer's Stone";

        await weaviateTestManager.importData();

        const board = new Board();
        const kit = board.addKit(WeaviateKit);

        kit
            .query()
            .wire("weaviateHost<-", board.input())
            .wire("query<-", board.input())
            .wire("alpha<-", board.input())
            .wire("className<-", board.input())
            .wire("fields<-", board.input())
            .wire("->searchResults", board.output());

        const results = await board.runOnce(inputs);
        const actualTitle = results.searchResults[0].title;
        
        expect(actualTitle).toEqual(expectedTitle);
    });

    // Add more tests for the "query" node here
});