function node(data) {
    this.next = null;
    this.data = data;
}

export function LinkedList() {
    this.start = null;
    this.end = null;
    this.length = 0;
}

LinkedList.prototype.add = function (data) {
    if (data === undefined) {
        throw new Error('data must be valid to add');
    }

    const newNode = new node(data);

    if (this.start === null) {
        this.start = newNode;
    } else {
        this.end.next = newNode;
    }

    this.length++;
    this.end = newNode;
};

LinkedList.prototype.remove = function (data) {
    if (data === undefined) {
        throw new Error('data must be valid to add');
    }
    if (this.start === null) {
        return;
    }

    let previous = null;
    let current = this.start;

    while ((current !== null) && (current.data !== data)) {
        previous = current;
        current = current.next;
    }

    if (current !== null) {
        if (previous === null) {
            this.start = this.start.next;
        }
        if (current.next === null) {
            this.end = previous;
            if (this.end !== null) {
                this.end.next = null;
            }
        }
        if ((previous !== null) && (current.next !== null)) {
            previous.next = current.next;
        }
        this.length--;
    }
};

export function StackQueue() {
    this.list = new LinkedList();
    this.length = 0;
}

function push(data) {
    this.list.add(data);
    this.length++;
}

function pop() {
    if (this.isEmpty()) {
        throw new Error('The stack/queue is empty');
    }

    const results = this.peek();

    this.list.remove(results);
    this.length--;
    return results;
}

function isEmpty() {
    return this.length === 0;
}

function clear() {
    this.list = new LinkedList();
    this.length = 0;
}

function peek() {
    return this.isEmpty() ? null : this.getNext();
}

StackQueue.prototype = { push, pop, isEmpty, clear, peek };

export function Stack() {
    StackQueue.apply(this, arguments);
}

Stack.prototype = new StackQueue();

Stack.prototype.getNext = function () {
    return this.list.end.data;
};
