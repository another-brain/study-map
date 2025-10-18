import { type DefaultSearchResults, Index } from 'flexsearch';
import jieba from 'nodejieba';
import { WordTokenizer } from 'natural/lib/natural/tokenizers';
import { TableName } from '../consts/db';
import { consola } from 'consola';

const tokenizer = new WordTokenizer();
function cutWords(contents: string[]) {
    return contents.flatMap(content =>
        tokenizer.tokenize(content).concat(jieba.cutForSearch(content))
    );
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
        this.init();
    }
    private async init() {
        const db = useDB();
        const result = await db.query.resource.findMany({
            columns: {
                id: true,
                name: true,
                description: true
            }
        });
        result.forEach(({ id, name, description }) => this.add(id, name, [name, description]));
    }
    public async add(id: number, title: string, contents: string[]) {
        try {
            this.index.remove(id);
            this.index.add(id, cutWords(contents).join(' '));
            this.titles.set(id, title);
            consola.info(`add ${this.key} index ${id} succeeded`);
        } catch (err) {
            consola.error(`add ${this.key} index ${id} failed: ${err}`);
        }
    }
    public async remove(id: number) {
        try {
            this.index.remove(id);
            this.titles.delete(id);
            consola.info(`remove ${this.key} index ${id} succeeded`);
        } catch (err) {
            consola.error(`remove ${this.key} index ${id} failed: ${err}`);
        }
    }
    public async update(id: number, title: string, contents: string[]) {
        return await this.index
            .updateAsync(id, cutWords(contents).join(''))
            .then(() => {
                this.titles.set(id, title);
                consola.info(`update ${this.key} index ${id} succeeded`);
            })
            .catch(err => {
                consola.error(`update ${this.key} index ${id} failed: ${err}`);
            });
    }
    public async search(keyword?: string, suggest?: boolean) {
        keyword = (keyword ?? '').trim();
        if (!keyword) {
            return [];
        }
        const source = [keyword];
        const queries = source.concat(cutWords(source));
        const tasks = new Array<Promise<DefaultSearchResults>>();
        for (const query of queries) {
            tasks.push(
                this.index.searchAsync({
                    query,
                    suggest
                })
            );
        }
        return Array.from(new Set((await Promise.all(tasks)).flat()));
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
