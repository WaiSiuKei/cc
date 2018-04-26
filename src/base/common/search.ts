import {INode} from "../../cc/dom/def";

export function depthFirstSearch(root: INode, matches: Function) {
    if (matches(root)) return root
    else {
        if (!root.children.length) return null
        let child = root.children[0]
        while (child) {
            if (depthFirstSearch(child, matches)) return child
            else child = child.nextSibling
        }
        return null
    }
}