<template>
    <li class="tree-node" :class="{ 'is-root': isRoot }">
        <div class="card" @click="$emit('select', node)">
            <p class="card-title">{{ node.name }}</p>
            <p v-if="node.dependency" class="card-dependency">{{ node.dependency }}</p>
            <p v-if="node.description" class="card-desc">{{ node.description }}</p>
        </div>

        <ul v-if="node.children && node.children.length > 0">
            <TreeNode v-for="child in node.children" :key="child._id" :node="child" @select="(n) => $emit('select', n)" />
        </ul>
    </li>
</template>

<script setup lang="ts">

defineProps({
    node: Object,
    isRoot: { type: Boolean, default: false }
})

defineEmits(['select'])

</script>

<style scoped>
.tree-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding-top: 24px;
    list-style: none;
}

.tree-node.is-root {
    padding-top: 0;
}

.tree-node.is-root::before,
.tree-node.is-root::after {
    display: none;
}

.tree-node::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: 24px;
    background: #d1d5db;
}

.tree-node::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: #d1d5db;
}

.tree-node:first-child::after {
    left: 50%;
}

.tree-node:last-child::after {
    right: 50%;
}

.tree-node:only-child::after {
    display: none;
}

.card {
    padding: 12px 20px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    min-width: 200px;
    max-width: 240px;
    text-align: center;
    transition: box-shadow 0.2s;
}

.card {
    cursor: pointer;
}

.card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    border-color: #6d28d9;
}

.card-title {
    font-size: 0.875rem;
    font-weight: 700;
    color: #111827;
}

.card-desc {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 4px;
    line-height: 1.4;
}

.card-dependency {
    font-size: 0.7rem;
    font-weight: 600;
    color: #6d28d9;
    margin-top: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.tree-node ul {
    display: flex;
    gap: 16px;
    padding-top: 24px;
    position: relative;
    list-style: none;
    margin: 0;
    padding-left: 0;
}

.tree-node ul::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: 24px;
    background: #d1d5db;
}
</style>
