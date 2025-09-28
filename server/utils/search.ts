import { type DefaultSearchResults, Index } from 'flexsearch';
import { cutForSearch } from 'nodejieba';
import { WordTokenizer } from 'natural';
import { TableName } from '../consts/db';

const { tokenize } = new WordTokenizer();
function cutWords(contents: string[]) {
    return contents.flatMap(content => tokenize(content).concat(cutForSearch(content)));
}

class SearchIndex {
    private index: Index;
    public constructor() {
        this.index = new Index({
            tokenize: 'strict',
            preset: 'score'
        });
    }
    public add(id: number, contents: string[]) {
        return this.index.addAsync(id, cutWords(contents).join(' '));
    }
    public async search(keyword?: string, suggest?: boolean) {
        keyword = (keyword ?? '').trim();
        if (!keyword) {
            return [];
        }
        const source = [keyword];
        const querys = source.concat(cutWords(source));
        const tasks = new Array<Promise<DefaultSearchResults>>();
        for (const query of querys) {
            tasks.push(
                this.index.searchAsync({
                    query,
                    suggest
                })
            );
        }
        return (await Promise.all(tasks)).flat();
    }
}

const resourceIndex = new SearchIndex();

export function useIndex(key: TableName) {
    switch (key) {
        case TableName.Resource:
            return resourceIndex;
        default:
            throw new Error('unimplemented');
    }
}
