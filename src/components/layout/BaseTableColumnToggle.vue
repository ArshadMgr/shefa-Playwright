<template>
    <div>
        <div v-if="toggleColumns" class=" mx-2_mb-2">
            <MultiSelect v-if="useSelect"
                v-model="toggleHeadings"
                :maxSelectedLabels="1"
                :options="tableHeadingsObject"
                :filter="filter"
                optionLabel="name"
                optionValue="value"
                placeholder="تبديل الأعمدة"
                selectedItemsLabel="{0} العناصر المحددة"
            >
            </MultiSelect>
            <div v-else class="columns-boxes d-flex flex-wrap justify-content-start">
                <div v-for="(heading, index) of tableHeadingsObject" :key="index" class="ms-2 my-2">
                    <div class="d-flex">
                        <Checkbox class="ms-2" v-model="toggleHeadings" name="heading" :value="heading.value" />
                        <label class="ms-2" :for="heading.value">{{ heading.name }}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, defineProps, nextTick, onMounted, Ref, ref, watch } from "vue";
const props = defineProps({
    table: {
        type: [HTMLTableElement,HTMLElement],
        required: true,
    },
    useSelect: {
        type: Boolean,
        default: true
    },
    filter: {
        type: Boolean,
        default: true
    },
    watch: {
        required: true
    },
    toggleColumns: {
        type: Boolean,
        default: true,
    }
});

const  refTable = computed(() => {
    let mainTable = props.table.getElementsByTagName('table')[0] ?? props.table
    return mainTable
})
const toggleHeadings: Ref = ref([]);
const tableHeadings: Ref = ref([]);
const headsElementsPosition : Ref = ref([]);

const tableHeadingsObject = computed(() => {
    let obj = tableHeadings.value.map(function (el : string, index : number) {
        return {
            value: index,
            name: el
        };
    });
    return obj;
})

async function hideTableColumns() {

    await nextTick()

    const tableRows = refTable.value?.getElementsByTagName("tbody")[0]
        ?.getElementsByTagName("tr");
    const tableHeadings = refTable.value?.getElementsByTagName("thead")[0]
        ?.getElementsByTagName("th");

    const positions : number[] = [];
    toggleHeadings.value?.forEach((element : number) => {
        /* for every active heading, get it's column posiiton */
        positions.push(headsElementsPosition.value[element]);
    });

    for (let headIndex : number = 0; headIndex < tableHeadings?.length; headIndex++) {
        let head = tableHeadings[headIndex];
        head.style.display = "";
        if (
            headsElementsPosition.value.includes(headIndex) &&
            !positions.includes(headIndex)
        ) {
            head.style.display = "none";
        }
    }
    for (let rowIndex = 0; rowIndex < tableRows.length; rowIndex++) {
        let row = tableRows[rowIndex];

        let rowData = row.getElementsByTagName("td");

        for (let r_index = 0; r_index < rowData.length; r_index++) {
            /* first unhide all elemnts */
            rowData[r_index].style.display = "";

            /* only hide those with headings which are tracked and are not in selected headings */
            if (headsElementsPosition.value.includes(r_index) && !positions.includes(r_index)) {
                rowData[r_index].style.display = "none";
            }
        }
    }
}

async function loadTableHeadings() {
    await nextTick();

    const headings : any = refTable.value?.getElementsByTagName("th");

    var validElementsCount = 0; /* elements with heading text */
    for (let index : number = 0; index < headings.length; index++) {
        let element = headings[index];
        if (element.innerText) {
            tableHeadings.value.push(element.innerText);

            toggleHeadings.value.push(validElementsCount);

            headsElementsPosition.value[
                validElementsCount
            ] = index; /* enter the element position in the html */
            validElementsCount++;
        }
    }
}
onMounted(() => {
    loadTableHeadings();
});
watch([toggleHeadings, props], () => {
    hideTableColumns();
});
</script>