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
    private key: TableName;
    private titles: Map<number, string>;
    public constructor(key: TableName) {
        this.key = key;
        this.index = new Index({
            tokenize: 'strict',
            preset: 'score'
        });
        this.titles = new Map();
    }
    public async add(id: number, title: string, contents: string[]) {
        return await this.index
            .addAsync(id, cutWords(contents).join(' '))
            .then(() => {
                this.titles.set(id, title);
                console.log(`add ${this.key} index ${id} succeeded`);
            })
            .catch(err => {
                console.log(`add ${this.key} index ${id} failed: ${err}`);
            });
    }
    public async remove(id: number) {
        return await this.index
            .removeAsync(id)
            .then(() => {
                this.titles.delete(id);
                console.log(`remove ${this.key} index ${id} succeeded`);
            })
            .catch(err => {
                console.log(`remove ${this.key} index ${id} failed: ${err}`);
            });
    }
    public async update(id: number, title: string, contents: string[]) {
        return await this.index
            .updateAsync(id, cutWords(contents).join(''))
            .then(() => {
                this.titles.set(id, title);
                console.log(`update ${this.key} index ${id} succeeded`);
            })
            .catch(err => {
                console.log(`update ${this.key} index ${id} failed: ${err}`);
            });
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
    public getName(id: number) {
        return this.titles.get(id);
    }
}

const indexes = Object.values(TableName)
    .map(name => ({
        [name]: new SearchIndex(name)
    }))
    .reduce(mergeObj) as Record<TableName, SearchIndex>;

export function useIndex(key: TableName) {
    return indexes[key];
}
