let session = {
    section: sessionStorage.getItem('section')?
             sessionStorage.getItem('section'):
             'notes',
}
session.section
const ContentSettings = {
    urls: {
        getNotes: 'drf/get-content/getNotes',
        getNoteFolders: 'drf/get-content/getNoteFolders',
        getNotices: 'drf/get-content/getNotices',
        getNoticeFolders: 'drf/get-content/getNoticeFolders',
    },
    token: '',  // authorization
    
}
const DADSettings = {  // general settings for DAD
    "DADObjectHeight": '58px',  // минимальный размер папок и записей
    "putBeetwenArea": 14.5,  // высота области (px) для логики "перемещения между" (в противовес перемещению внутрь)
    "draggableClass": 'draggableObject',  // название класса, который участвует в DAD
    "folderClass": 'folder',  // название класса у каждой папки
    "recordClass": 'record',  // название класса у каждой записи
}
// let DADObject = {  // Properties of the selected dragging Object
//     "typeObject": null,  // record or folder
//     "object": null,  // the object itself
//     "text": null
// }
// let stickyDAD  // Drag And Drop HTML Object attached to mouse (pointer)
const stickyDADSettings = {  // size of DAD Object
    "width": 300,
    "height": 44,
    "opacity": '60%',
    "border-color": 'rgb(255, 0, 221)',
}

// // мы будем запомним элемент и четверть в Move-событии для обработки End-события
// let draggingVariables = {
//     "dragRelocate": null, // Элемент, над которым был курсор при перемещении объекта
//     "dragRelocateQuarter": null, // четверть, над которым был курсор при перемещении объекта (1 или 4)
//     "dragPutInside": null // папка, в которую был помещен объект
// }

// // переменная, необходимая для запоминания элемента, с которого ушел курсор
// // это необходимо для снятия выделения ячейки
// // event.target и event.relatedTarget почему-то на телефоне не работают - см. примечание
// let leaveObjects = {
//     "previous": null,
//     "next": null
// }

// let isClick = false // включает в down, выключается в move (для вхождения в папку)

const classNames = {
    settingIcon: 'setting-field',  // gear for each records and folders
    backFolder: 'folder-back',  // folder for moving back in the directory
    stickyDAD: 'stickyDAD'  // an object attached to the mouse
}

let modals = {
    modal: null,

    sort: {
        that: this,

        byAlphabet: function() {
            console.log('сортировка по алфавиту')
        },
        byDate: function() {
            console.log('сортировка по дате')
        },
        Custom: function() {
            console.log('пользовательская сортировка')
        },
    },
    hideModal: function(event) {
        if (
            (event.target != globalShadow) &&
            // (event.currentTarget != modalCross) &&
            (event.key != 'Escape')
        ) return
        modalBlock.style['display'] = 'none'
        // console.log('modal', modal)
        console.log('this.modal', this.modal)
        this.modal.style['display'] = 'none'
    },
    hideModalCross: function(event) {
        if (event.target.closest('.modal-cross')) {
            modalBlock.style['display'] = 'none'
            this.modal.style['display'] = 'none'
        }
    },
    getModal: function(event) {
        console.log(this.modal)
        this.modal = document.getElementById(event.target.dataset.modal)
        this.modal.style['display'] = 'block'
        console.log('target = ',event.target)
        console.log('modal = ', event.target.dataset.modal)
        modalBlock.style['display'] = 'block'
    },

    run: function() {
        modalBlock.addEventListener('click', this.hideModal.bind(this))
        document.addEventListener('click', this.hideModalCross.bind(this))

        modalSortBtn.addEventListener('click', this.getModal.bind(this))
        modalCreateBtn.addEventListener('click', this.getModal.bind(this))
        modalCreateFBtn.addEventListener('click', this.getModal.bind(this))

        document.addEventListener('keyup', this.hideModal.bind(this))
    }
}
modals.run()

let search = {
    getSearchList: function() {
        // получение полного списка потенциальных объектов
        searchListTest = [ // Заглушка для теста до получения настоящего контента
            'О Нас',
            'Основа',
            'Блог',
            'Контакт',
            'Заказ',
            'Поддержка',
            'Инструменты',
        ]
        return searchListTest
    },
    showSearchList: function(event) {
        // поиск 
        if (event.target != searchQueryInput) return // событие вне searc поля (доп. проверка)

        let searchValueUpper = searchQueryInput.value.toUpperCase()
        if (searchValueUpper == '') { // если поисковое слово удалено
            searchDropdown.style['display'] = 'none'
            searchDropdown.innerHTML = ''
            return
        }

        searchDropdown.style['display'] = 'block'
        searchDropdown.innerHTML = ''
        // console.log('Value of #searchQueryInput is ', searchValueUpper)
        searchListOriginal = this.getSearchList()
        seacrhListFiltered = []
        for (let i = 0; i < searchListOriginal.length; i++) {
            if (searchListOriginal[i].toUpperCase().includes(searchValueUpper)) {
                seacrhListFiltered.push(searchListOriginal[i])
            }
        }
        for (let i = 0; i < seacrhListFiltered.length; i++) {
            searchElemI = document.createElement('a')
            searchElemI.href = '#' + seacrhListFiltered[i]
            searchElemI.innerHTML = seacrhListFiltered[i]
            searchDropdown.append(searchElemI)
        }
    },
    hideSearchList: function(event) {
        // удаление выпадающего списка строки поиска
        if (searchDropdown.style['display'] != 'block') return // выпадающего списка нет
        if (event.target == searchQueryInput) return // нажатие по поисковой строке
        searchDropdown.style['display'] = 'none'
        searchDropdown.innerHTML = ''
    },
    run: function() {
        searchQueryInput.addEventListener('input', this.showSearchList.bind(this))
        document.addEventListener('click', this.hideSearchList.bind(this))
    }
}
search.run()

// let contentTest = {
//     type: null, // notes or notices
//     folders: null,
//     notes: null,
//     notices: null,

//     getFolderList: function() {
//         let noteFolderList = [ // заглушка для теста
//             {
//                 id: 'f1',
//                 title: "note-folder 1",
//                 labels: "labelsF 1",
//                 color: 'yellow'
//             },
//             {
//                 id: 'f2',
//                 title: "note-folder 2",
//                 labels: "labelsF 2",
//                 color: 'green'
//             }
//         ]
//         this.folders = noteFolderList
//         return noteFolderList
//     },
//     getNotes: function() {
//         let noteContentList = [ // заглушка для теста
//             {
//                 id: 'n1',
//                 title: "note-block 1",
//                 labels: "labels 1",
//                 color: 'yellow'
//             },
//             {
//                 id: 'n2',
//                 title: "note-block 2",
//                 labels: "labels 2",
//                 color: 'red'
//             },
//             {
//                 id: 'n3',
//                 title: "note-block 3",
//                 labels: "labels 3",
//                 color: 'green'
//             }
//         ]
//         this.notes = noteContentList
//         return noteContentList
//     },
//     getNoties: function() {
//         let notiesList = [ // заглушка для теста

//         ]
//         this.noties = notiesList
//         return notiesList
//     },
//     viewObjects: function() {
//         let type = session.section
//         let folderLst = this.folders
//         let entities = this[type]

//         if (entities === null) { // delete when notices works 
//             console.log('notices doest work')
//             return
//         }

//         for (let i=0; i<folderLst.length; i++) {
//             this.createFolder(
//                 folderLst[i].id, folderLst[i].title, 
//                 folderLst[i].labels, folderLst[i].color
//             )
//         }
    
//         for (let i=0; i<entities.length; i++) {
//             if (type=="notes") {
//                 this.createNote(
//                     id=entities[i].id,
//                     title=entities[i].title, 
//                     labelsLst=entities[i].labels,
//                     color=entities[i].color,
//                     objtype='note'
//                 )
//             } else if (type=="notices") {
//                 this.createNotice(
//                     id=entities[i].id,
//                     title=entities[i].title, 
//                     labelsLst=entities[i].labels,
//                     color=entities[i].color,
//                     objtype='notices',
//                     datetime=entities[i].datetime
//                 )
//             } else alert('viewObjects wrong!')
//         }
//     },
//     createNote: function(id, title, labelsLst, color, objtype, datetime) {
//         let noteBlock = document.createElement("div")
//         let blockRow = document.createElement("div")
//         let coll1 = document.createElement("div")
//             let marker = document.createElement("div")
//             // svg
//         let coll2 = document.createElement("div")
//             if (objtype==='noties') {
//                 let datetime = document.createElement("div")
//                 let datetimeP = document.createElement("div")
//                 let space = document.createElement("span")
//             }
//             let titleBlock = document.createElement("div")
//                 let titleP = document.createElement("p")
//         let coll3 = document.createElement("div")
//             let labels = document.createElement("div")
//             // svg

//         noteBlock.className = "dd-object"
//         noteBlock.id = id
//         blockRow.className = 'block-row'
//         coll1.className = 'coll1'
//         coll2.className = 'coll2'
//         coll3.className = 'coll3'
//         marker.className = 'marker'
//         marker.dataset['color'] = color
//         if (objtype==='noties') {
//             datetime.className = 'datetime'
//             datetimeP.textContent = datetime
//             space.textContent = ' — '
//         }
//         titleBlock.className = 'title'
//         titleP.textContent = title
//         labels.className = 'labels'
//         labels.textContent = 'labels'

//         objectsList.append(noteBlock)
//         noteBlock.append(blockRow)
//         blockRow.append(coll1, coll2, coll3)
//         coll1.append(marker)
//         if (objtype==='noties') {
//             coll2.append(datetime)
//             datetime.append(datetimeP)
//             coll2.append(space)
//         }
//         coll2.append(titleBlock)
//         titleBlock.append(titleP)
//         coll3.append(labels)

//         this.createSVG(  // type
//             parent=coll1,
//             className='content-svg',
//             viewBox='2 0 20 24',
//             pathLst=[
//                 'm7 12h10v2h-10zm0 6h7v-2h-7zm15-10.414v16.414h-20v-21a3 3 0 0 1 3-3h9.414zm-7-.586h3.586l-3.586-3.586zm5 15v-13h-7v-7h-8a1 1 0 0 0 -1 1v19z',
//             ]
//         )
//         this.createSVG(  // settings
//             parent=coll3,
//             className='content-svg',
//             viewBox='0 0 24 24',
//             pathLst=[
//                 'M12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z',
//                 'M21.294,13.9l-.444-.256a9.1,9.1,0,0,0,0-3.29l.444-.256a3,3,0,1,0-3-5.2l-.445.257A8.977,8.977,0,0,0,15,3.513V3A3,3,0,0,0,9,3v.513A8.977,8.977,0,0,0,6.152,5.159L5.705,4.9a3,3,0,0,0-3,5.2l.444.256a9.1,9.1,0,0,0,0,3.29l-.444.256a3,3,0,1,0,3,5.2l.445-.257A8.977,8.977,0,0,0,9,20.487V21a3,3,0,0,0,6,0v-.513a8.977,8.977,0,0,0,2.848-1.646l.447.258a3,3,0,0,0,3-5.2Zm-2.548-3.776a7.048,7.048,0,0,1,0,3.75,1,1,0,0,0,.464,1.133l1.084.626a1,1,0,0,1-1,1.733l-1.086-.628a1,1,0,0,0-1.215.165,6.984,6.984,0,0,1-3.243,1.875,1,1,0,0,0-.751.969V21a1,1,0,0,1-2,0V19.748a1,1,0,0,0-.751-.969A6.984,6.984,0,0,1,7.006,16.9a1,1,0,0,0-1.215-.165l-1.084.627a1,1,0,1,1-1-1.732l1.084-.626a1,1,0,0,0,.464-1.133,7.048,7.048,0,0,1,0-3.75A1,1,0,0,0,4.79,8.992L3.706,8.366a1,1,0,0,1,1-1.733l1.086.628A1,1,0,0,0,7.006,7.1a6.984,6.984,0,0,1,3.243-1.875A1,1,0,0,0,11,4.252V3a1,1,0,0,1,2,0V4.252a1,1,0,0,0,.751.969A6.984,6.984,0,0,1,16.994,7.1a1,1,0,0,0,1.215.165l1.084-.627a1,1,0,1,1,1,1.732l-1.084.626A1,1,0,0,0,18.746,10.125Z'
//             ]
//         )
//     },
//     createNotice: function(id, title, labels, color, datetime) {
//         console.log("createNotice")
//     },
//     createFolder: function(id, title, labels, color, datetime) {
//         console.log("createFolder, id=", id)
//     },
//     createSVG: function(parent, className, viewBox, pathLst) {
//         let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
//         svg.setAttributeNS(null, 'class', className)
//         svg.setAttributeNS(null, 'viewBox', viewBox)
//         for (let i=0; i < pathLst.length; i++) {
//             let svgPath = document.createElementNS("http://www.w3.org/2000/svg", 'path')
//             svgPath.setAttributeNS(null, 'd', pathLst[i])
//             svg.appendChild(svgPath)
//         }
//         parent.append(svg)
//         // https://ru.stackoverflow.com/questions/1123250/%D0%9A%D0%B0%D0%BA-%D0%B2%D1%81%D1%82%D0%B0%D0%B2%D0%B8%D1%82%D1%8C-svg-%D0%BA%D0%BE%D0%B4-%D0%BD%D0%B0-%D1%81%D0%B0%D0%B9%D1%82-%D1%81-%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D1%8C%D1%8E-js    
//     },
//     removeObjects: function() {
//         objectsList.innerHTML = ''
//     },
//     run: function() {
//         this.getNotes()
//         this.getFolderList()
//         this.getNoties()
//         // this.viewObjects(session.section)
//     }
// }
// contentTest.run()

let Header = {
    sections: document.getElementById('sections'),

    headerClick: function(event) {
        let sec = event.target.closest('.header-field')
        if (!sec) return

        section = event.target.closest('.header-field').id
        sessionStorage.setItem('section', section)
        session.section = section

        this.toggleHeaderField()
        if (session.section === 'notes') {
            viewContent.currentFolderId = content.notesRoot
        } else if (session.section === 'notices') {
            viewContent.currentFolderId = content.noticesRoot
        }
        
        viewContent.removeObjects()
        viewContent.displayItems()
        path.getPathList()
        path.viewPath()

    },
    toggleHeaderField: function() {
        let section = document.getElementById(session.section)
        let sectionSecond = session.section==='notes'?
                            document.getElementById('notices'):
                            document.getElementById('notes')
        section.classList.add('selected')
        sectionSecond.classList.remove('selected')
    },
    run: function() {
        this.toggleHeaderField()
        this.sections.addEventListener('click', this.headerClick.bind(this))
    }
}
Header.run()

let content = {
    notes: null,  // dict of notes
    noteFolders: null,  // dict of note folders
    notices: null,  // dict of notices
    noticeFolders: null,  // dict of notice folders
    notesRoot: null,  // root folder id
    noticesRoot: null,  // root folder id

    Note: function(record_id, note_name, order_id, color, parent_id) {
        // create note object using new notation
        this.record_id = record_id  // name like notice
        this.title = note_name
        this.order_id = order_id
        this.color = color
        this.parent_id = parent_id  // folder id
    },
    Notice: function(record_id, notice_name, order_id, color, parent_id, date, time) {
        // create notice object using new notation
        this.record_id = record_id  // name like note
        this.title = notice_name
        this.order_id = order_id
        this.color = color
        this.parent_id = parent_id  // folder id
        this.date = date
        this.time = time
    },
    Folder: function(folder_id, folder_name, order_id, color, parent_id) {
        // create folder object using new notation
        this.folder_id = folder_id
        this.title = folder_name
        this.order_id = order_id
        this.color = color
        this.parent_id = parent_id
    },

    getContentAJAX: function(url, token) { // заглушка
        // getting list like content from the server by url

        // сейчас работает заглушка. В зависимости от url вовращается разный контент
        let notes = [  // заглушка
            [7, 'record 1', 1, null, 7],
            [11, 'record 1.1', 1, 'red', 9],
            [24, 'record 1.1.1', 1, 'yellow', 8],
            [34, 'record 1.2.1', 1, 'green', 21],
            [29, 'record 1.3.1', 1, null, 22],
            [17, 'record 2.1', 1, null, 10],
            [32, 'record 3.1', 1, 'red', 16],
            [55, 'record 3.1.1', 1, 'green', 17],
            [56, 'record 4.1.1', 1, 'yellow', 27],

            [9, 'record 2', 2, null, 7],
            [13, 'record 1.2', 2, 'yellow', 9],
            [27, 'record 1.1.2', 2, 'red', 8],
            [41, 'record 1.2.2', 2, null, 21],
            [18, 'record 2.2', 2, null, 10],
            [53, 'record 3.1.2', 2, 'green', 17],
            [61, 'record 4.1.2', 2, 'red', 27],

            [5, 'record 3', 3, null, 7],
            [4, 'record 4', 4, 'yellow', 7],
            [12, 'record 5', 5, 'red', 7],
            [14, 'record 6', 6, null, 7],
            [26, 'record 7', 7, null, 7],
            [32, 'record 8', 8, 'green', 7],
            [19, 'record 9', 9, 'green', 7],
            [47, 'record 10', 10, null, 7],
        ]
        let noteFolders = [
            [7, 'root', 1, null, 0],
            [8, 'папка 1.1', 1, null, 9],
            [9, 'папка 1', 1, null, 7],
            [17, 'папка 3.1', 1, null, 16],
            [23, 'папка 1.1.1', 1, null, 8],
            [27, 'папка 4.1', 1, null, 14],
            [34, 'папка 3.1.1', 1, null, 17],
            [36, 'папка 3.1.1.1', 1, null, 34],
            [10, 'папка 2', 2, 'red', 7],
            [21, 'папка 1.2', 2, 'yellow', 9],
            [16, 'папка 3', 3, 'green', 7],
            [22, 'папка 1.3', 3, null, 9],
            [14, 'папка 4', 4, 'yellow', 7],
        ]
        let notices = [
            [7, 'notice 1', 1, null, 7, '15.05.2025', '12:00'],
            [11, 'notice 1.1', 1, 'red', 9, '15.05.2025', '12:00'],
            [24, 'notice 1.1.1', 1, 'yellow', 8, '15.05.2025', '12:00'],
            [34, 'notice 1.2.1', 1, 'green', 21, '15.05.2025', '12:00'],
            [29, 'notice 1.3.1', 1, null, 22, '15.05.2025', '12:00'],
            [17, 'notice 2.1', 1, null, 10, '15.05.2025', '12:00'],
            [32, 'notice 3.1', 1, 'red', 16, '15.05.2025', '12:00'],
            [55, 'notice 3.1.1', 1, 'green', 17, '15.05.2025', '12:00'],
            [56, 'notice 4.1.1', 1, 'yellow', 27, '15.05.2025', '12:00'],

            [9, 'notice 2', 2, null, 7, '15.05.2025', '12:00'],
            [13, 'notice 1.2', 2, 'yellow', 9, '15.05.2025', '12:00'],
            [27, 'notice 1.1.2', 2, 'red', 8, '15.05.2025', '12:00'],
            [41, 'notice 1.2.2', 2, null, 21, '15.05.2025', '12:00'],
            [18, 'notice 2.2', 2, null, 10, '15.05.2025', '12:00'],
            [53, 'notice 3.1.2', 2, 'green', 17, '15.05.2025', '12:00'],
            [61, 'notice 4.1.2', 2, 'red', 27, '15.05.2025', '12:00'],

            [5, 'notice 3', 3, null, 7, '15.05.2025', '12:00'],
            [4, 'notice 4', 4, 'yellow', 7, '15.05.2025', '12:00'],
            [12, 'notice 5', 5, 'red', 7, '15.05.2025', '12:00'],
            [14, 'notice 6', 6, null, 7, '15.05.2025', '12:00'],
            [26, 'notice 7', 7, null, 7, '15.05.2025', '12:00'],
            [32, 'notice 8', 8, 'green', 7, '15.05.2025', '12:00'],
            [19, 'notice 9', 9, 'green', 7, '15.05.2025', '12:00'],
            [47, 'notice 10', 10, null, 7, '15.05.2025', '12:00'],
        ]
        let noticeFolders = [
            [7, 'root', 1, null, 0],
            [8, 'папка 1.1', 1, null, 9],
            [9, 'папка 1 notice', 1, null, 7],
            [17, 'папка 3.1', 1, null, 16],
            [23, 'папка 1.1.1', 1, null, 8],
            [27, 'папка 4.1', 1, null, 14],
            [34, 'папка 3.1.1', 1, null, 17],
            [36, 'папка 3.1.1.1', 1, null, 34],
            [10, 'папка 2', 2, 'red', 7],
            [21, 'папка 1.2', 2, 'yellow', 9],
            [16, 'папка 3', 3, 'green', 7],
            [22, 'папка 1.3', 3, null, 9],
            [14, 'папка 4', 4, 'yellow', 7],
        ]
        
        let lst = null
        if (url==ContentSettings.urls.getNotes) {
            lst = notes
        } else if (url==ContentSettings.urls.getNoteFolders) {
            lst = noteFolders
        } else if (url==ContentSettings.urls.getNotices) {
            lst = notices
        } else if (url==ContentSettings.urls.getNoticeFolders) {
            lst = noticeFolders
        } else {
            console.log('Content Error: Url doesnt exists!')
            return
        }
        return lst
    },
    getListOfObjects: function(url, objClass) {
        let listOfLists = this.getContentAJAX(url, ContentSettings.token)
        let listOfObjects = []
        for (let i=0;i<listOfLists.length;i++) {
            listOfObjects.push(new objClass(...listOfLists[i]))
        }
        return listOfObjects
    },
    getDictOfRecords: function(listOfRecords) {
        // getting dictionary of records by record_id
        let record_dict = {}
        for (let record_i=0; record_i < listOfRecords.length; record_i++) {
            record_dict[listOfRecords[record_i].record_id] = listOfRecords[record_i]
        }
        return record_dict
    },
    getDictOfFolders: function(listOfFolders) {
        // Getting dictionary of folders by folder_id. Has the following form:
        // folder_dict = {
        //     folder_id:{
        //         folders:[...], - IDs of folders inside the folder with folder_id
        //         records:[...], - IDs of records inside the folder with folder_id
        //         info - information about the folder with folder_id
        //     }, 
        //     ...
        // }
        let folderDict = {}
        for (let folder_i=0; folder_i < listOfFolders.length; folder_i++) {
            folderDict[listOfFolders[folder_i].folder_id] = {
                folders: [],
                records: [],
                info: listOfFolders[folder_i]
            }
        }
        for (let folder_i=0; folder_i < listOfFolders.length; folder_i++) {
            if (listOfFolders[folder_i].parent_id==0) continue
            folderDict[listOfFolders[folder_i].parent_id].folders.push(listOfFolders[folder_i].folder_id)
        }
        return folderDict
    },
    fillOutFolderDict: function(folderDict, recordList) {
        // fill out record id in folders
        for (let record_i=0; record_i < recordList.length; record_i++) {
            folderDict[recordList[record_i].parent_id].records.push(recordList[record_i].record_id)
        }
        return folderDict
    },
    getContent: function() {

        let notesList = this.getListOfObjects(ContentSettings.urls.getNotes, this.Note)
        let noteFoldersList = this.getListOfObjects(ContentSettings.urls.getNoteFolders, this.Folder)
        let notesDict = this.getDictOfRecords(notesList)
        let noteFoldersDict = this.getDictOfFolders(noteFoldersList)
        let noteFoldersDictFilled = this.fillOutFolderDict(noteFoldersDict, notesList)

        let noticesList = this.getListOfObjects(ContentSettings.urls.getNotices, this.Notice)
        let noticeFoldersList = this.getListOfObjects(ContentSettings.urls.getNoticeFolders, this.Folder)
        let noticesDict = this.getDictOfRecords(noticesList)
        let noticeFoldersDict = this.getDictOfFolders(noticeFoldersList)
        let noticeFoldersDictFilled = this.fillOutFolderDict(noticeFoldersDict, noticesList)
        
        this.notes = notesDict
        this.noteFolders = noteFoldersDictFilled
        this.notices = noticesDict
        this.noticeFolders = noticeFoldersDictFilled

        this.notesRoot = noteFoldersList[0].folder_id
        this.noticesRoot = noticeFoldersList[0].folder_id
    },
    run: function() {
        this.getContent()
        
    }
}
content.run()

let viewContent = {
    currentType: null,
    currentFolderId: null,
    
    displayItems: function() {  // display all DAD-objects
        // отображение должно подождать завершения ajax запроса контента!!!!!!!
        let foldersDict, recordsDict, foldersIdList,recordsIdList, isRoot
        if (session.section === 'notes') {
            foldersDict = content.noteFolders
            recordsDict = content.notes
            foldersIdList = content.noteFolders[this.currentFolderId].folders
            recordsIdList = content.noteFolders[this.currentFolderId].records
        } else if (session.section === 'notices') {
            foldersDict = content.noticeFolders
            recordsDict = content.notices
            foldersIdList = content.noticeFolders[this.currentFolderId].folders
            recordsIdList = content.noticeFolders[this.currentFolderId].records
        } else {
            console.log('viewContent Error: records type doesnt exist')
        }

        // display back-folder
        let parent_id = foldersDict[this.currentFolderId].info.parent_id
        if (parent_id !== 0) {
            this.createBackFolder(parent_id)
        }

        for (let i=0; i<foldersIdList.length; i++) {
            // this.createFolder(
            //     id=foldersDict[foldersIdList[i]].info.folder_id,
            //     title=foldersDict[foldersIdList[i]].info.title,
            //     labels=null,
            //     color=foldersDict[foldersIdList[i]].info.color,
            // )
            this.createObject(
                id=foldersDict[foldersIdList[i]].info.folder_id,
                title=foldersDict[foldersIdList[i]].info.title,
                labels=null,
                color=foldersDict[foldersIdList[i]].info.color,
                objtype=DADSettings.folderClass,
            )
        }
        for (let i=0; i<recordsIdList.length; i++) {
            this.createObject(
                id=recordsDict[recordsIdList[i]].record_id,
                title=recordsDict[recordsIdList[i]].title,
                labelsList=null,
                color=recordsDict[recordsIdList[i]].color,
                objtype=DADSettings.recordClass,
                datetime=recordsDict[recordsIdList[i]].date+' '+recordsDict[recordsIdList[i]].time
            )
        }

    },
    createBackFolder: function(parent_id) {  // display object to return to the parent folder
        let block = document.createElement("div")
        let titleP = document.createElement("p")
        block.classList.add(classNames.backFolder)
        block.classList.add(DADSettings.folderClass)
        block.id = parent_id
        titleP.textContent = 'Вернуться...'
        objectsList.append(block)
        block.append(titleP)
    },
    createObject: function(id, title, labelsList, color, objtype, datetime) {  // create any DAD-object

        let isNotices = session.section==='notices'
        let isRecord = objtype===DADSettings.recordClass

        let noteBlock = document.createElement("div")
        let blockRow = document.createElement("div")
        let coll1 = document.createElement("div")
            let marker = document.createElement("div")
            // svg
        let coll2 = document.createElement("div")
            let datetimeObj, datetimeP, space
            if (isNotices&&isRecord) {
                datetimeObj = document.createElement("div")
                datetimeP = document.createElement("div")
                space = document.createElement("span")
            }
            
            let titleBlock = document.createElement("div")
                let titleP = document.createElement("p")
        let coll3 = document.createElement("div")
            let labels = document.createElement("div")
            // svg

        // noteBlock.className = "dd-object"
        noteBlock.classList.add('dd-object')
        noteBlock.classList.add('draggableObject')
        if (isRecord) {
            noteBlock.classList.add(DADSettings.recordClass)
        } else {
            noteBlock.classList.add(DADSettings.folderClass)
        }
        noteBlock.id = id
        blockRow.className = 'block-row'
        coll1.className = 'coll1'
        coll2.className = 'coll2'
        coll3.className = 'coll3'
        marker.className = 'marker'
        marker.dataset['color'] = color
        if (isNotices&&isRecord) {
            datetimeObj.className = 'datetime'
            datetimeP.textContent = datetime
            space.textContent = ' — '
        }
        titleBlock.className = 'title'
        titleP.textContent = title
        labels.className = 'labels'
        labels.textContent = 'labels'

        objectsList.append(noteBlock)
        noteBlock.append(blockRow)
        blockRow.append(coll1, coll2, coll3)
        coll1.append(marker)
        if (isNotices&&isRecord) {
            coll2.append(datetimeObj)
            datetimeObj.append(datetimeP)
            coll2.append(space)
        }
        coll2.append(titleBlock)
        titleBlock.append(titleP)
        coll3.append(labels)

        this.createSVG(  // type
            parent=coll1,
            className='content-svg',
            viewBox='2 0 20 24',
            pathLst=[
                'm7 12h10v2h-10zm0 6h7v-2h-7zm15-10.414v16.414h-20v-21a3 3 0 0 1 3-3h9.414zm-7-.586h3.586l-3.586-3.586zm5 15v-13h-7v-7h-8a1 1 0 0 0 -1 1v19z',
            ]
        )
        this.createSVG(  // settings
            parent=coll3,
            className='content-svg',
            viewBox='0 0 24 24',
            pathLst=[
                'M12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z',
                'M21.294,13.9l-.444-.256a9.1,9.1,0,0,0,0-3.29l.444-.256a3,3,0,1,0-3-5.2l-.445.257A8.977,8.977,0,0,0,15,3.513V3A3,3,0,0,0,9,3v.513A8.977,8.977,0,0,0,6.152,5.159L5.705,4.9a3,3,0,0,0-3,5.2l.444.256a9.1,9.1,0,0,0,0,3.29l-.444.256a3,3,0,1,0,3,5.2l.445-.257A8.977,8.977,0,0,0,9,20.487V21a3,3,0,0,0,6,0v-.513a8.977,8.977,0,0,0,2.848-1.646l.447.258a3,3,0,0,0,3-5.2Zm-2.548-3.776a7.048,7.048,0,0,1,0,3.75,1,1,0,0,0,.464,1.133l1.084.626a1,1,0,0,1-1,1.733l-1.086-.628a1,1,0,0,0-1.215.165,6.984,6.984,0,0,1-3.243,1.875,1,1,0,0,0-.751.969V21a1,1,0,0,1-2,0V19.748a1,1,0,0,0-.751-.969A6.984,6.984,0,0,1,7.006,16.9a1,1,0,0,0-1.215-.165l-1.084.627a1,1,0,1,1-1-1.732l1.084-.626a1,1,0,0,0,.464-1.133,7.048,7.048,0,0,1,0-3.75A1,1,0,0,0,4.79,8.992L3.706,8.366a1,1,0,0,1,1-1.733l1.086.628A1,1,0,0,0,7.006,7.1a6.984,6.984,0,0,1,3.243-1.875A1,1,0,0,0,11,4.252V3a1,1,0,0,1,2,0V4.252a1,1,0,0,0,.751.969A6.984,6.984,0,0,1,16.994,7.1a1,1,0,0,0,1.215.165l1.084-.627a1,1,0,1,1,1,1.732l-1.084.626A1,1,0,0,0,18.746,10.125Z'
            ]
        )
    },
    // createNotice: function(id, title, labels, color, datetime) {
    //     console.log("createNotice")
    // },
    // createFolder: function(id, title, labels, color) {
    //     console.log("createFolder, id=", id)
    // },
    createSVG: function(parent, className, viewBox, pathLst) {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttributeNS(null, 'class', className)
        svg.setAttributeNS(null, 'viewBox', viewBox)
        for (let i=0; i < pathLst.length; i++) {
            let svgPath = document.createElementNS("http://www.w3.org/2000/svg", 'path')
            svgPath.setAttributeNS(null, 'd', pathLst[i])
            svg.appendChild(svgPath)
        }
        parent.append(svg)
        // https://ru.stackoverflow.com/questions/1123250/%D0%9A%D0%B0%D0%BA-%D0%B2%D1%81%D1%82%D0%B0%D0%B2%D0%B8%D1%82%D1%8C-svg-%D0%BA%D0%BE%D0%B4-%D0%BD%D0%B0-%D1%81%D0%B0%D0%B9%D1%82-%D1%81-%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D1%8C%D1%8E-js    
    },
    removeObjects: function() { // clean DAD-area, delete all DAD-objects
        let objectsList = document.getElementById('objectsList')
        objectsList.innerHTML = ''
    },
    openObject: function(event) { // open record or folder or back-folder
        let isDDobject = event.target.closest('.dd-object')
        let isBackFolder = event.target.closest(`.${classNames.backFolder}`)
        if (!(isDDobject || isBackFolder)) return
        
        let folder = event.target.closest('.folder')
        let record = event.target.closest('.record')
        if (folder) {
            this.openFolder(folder.id)
        }
        if (record) {
            this.openRecord(record.id)
        }
    },
    openFolder: function(folder_id) {
        console.log('Открытие папки ', session.section,' типа, id=', folder_id)
        this.currentFolderId = folder_id
        viewContent.removeObjects()
        viewContent.displayItems()
        path.getPathList()
        path.viewPath()
    },
    openRecord: function(record_id) {
        console.log('Переход на страницу записи ', session.section,' типа, id=', record_id)
        // console.log(window.location.pathname)
        // window.location.pathname = '/notes/' + record_id
    },
    run: function() {
        this.currentFolderId = content.notesRoot
        this.displayItems() // отображение должно подождать завершения ajax запроса контента!!!!!!!
        let ddArea = document.getElementById('objectsList')
        ddArea.addEventListener('click', this.openObject.bind(this))
    }
}
viewContent.run()

let path = {  // Directory of folders at the top 
    pathList: [], // list of objects like [{name, id},...]

    getPathList: function() {  // generate list of folder path for directory

        this.pathList = []
        let parentId = viewContent.currentFolderId
        let currentFolderType
        if (session.section==='notes') {
            currentFolderType = content.noteFolders
        } else if (session.section==='notices') {
            currentFolderType = content.noticeFolders
        }
        this.pathList.unshift({  // Current folder
            name: currentFolderType[parentId].info.title,
            id: parentId
        })

        while (parentId!=0) {  // other elems
            parentId = currentFolderType[parentId].info.parent_id
            if (parentId===0) break
            this.pathList.unshift({
                name: currentFolderType[parentId].info.title,
                id: parentId
            })
        }
        if (this.pathList[0]) { // First folder (section)
            if (session.section==='notes') {
                this.pathList[0].name = 'Заметки'
            } else if (session.section==='notices') {
                this.pathList[0].name = 'Напоминания'
            }
        }
    },
    viewPath: function() {  // display directory
        let path = document.getElementById('path')
        path.innerHTML = ''
        for (let i=0; i<this.pathList.length; i++) {
            if (i>0) {
                let delimiter = document.createElement('span')
                delimiter.className = 'path-delimiter'
                delimiter.textContent = ' / '
                path.append(delimiter)
            }

            let pathFolder = document.createElement('div')
            pathFolder.className = 'path-folder'
            pathFolder.textContent = this.pathList[i].name
            path.append(pathFolder)
        }
    },
    getPath: function(event) {  // open the folder using the directory by click
        if (event.target.className != 'path-folder') return
        let newFolderId
        for (let i=0; i<this.pathList.length; i++) {
            if (this.pathList[i].name === event.target.textContent) {
                newFolderId = this.pathList[i].id
            }
        }
        viewContent.openFolder(newFolderId)
    },
    run: function() {
        this.getPathList()
        this.viewPath()
        let path = document.getElementById('path')
        path.addEventListener('click', this.getPath.bind(this))
    }
}
path.run()

let DragAndDrop = {
    DADObject: {  // Properties of the selected dragging Object
        "typeObject": null,  // record or folder
        "object": null,  // the object itself
        "text": null
    },
    stickyDAD: null,  // Drag And Drop HTML Object attached to mouse (pointer)
    
    // мы будем запомним элемент и четверть в Move-событии для обработки End-события
    draggingVariables: {
        "dragRelocate": null, // Элемент, над которым был курсор при перемещении объекта
        "dragRelocateQuarter": null, // четверть, над которым был курсор при перемещении объекта (1 или 4)
        "dragPutInside": null // папка, в которую был помещен объект
    },

    // переменная, необходимая для запоминания элемента, с которого ушел курсор
    // это необходимо для снятия выделения ячейки
    // event.target и event.relatedTarget почему-то на телефоне не работают - см. примечание
    leaveObjects: {
        "previous": null,
        "next": null
    },

    isClick: false, // включает в down, выключается в move (для вхождения в папку)

    //////////////////////////////////////////////////////////////////////
    // Mouse PRESS events
    //////////////////////////////////////////////////////////////////////
    pointerDownEvent: function(event) {  // click the draggable object
        let isFolder = document.elementFromPoint(event.clientX, event.clientY).closest(`.${DADSettings.folderClass}`)
        let isRecord = document.elementFromPoint(event.clientX, event.clientY).closest(`.${DADSettings.recordClass}`)
        if ((isFolder??isRecord)&&event.which != 3) {
            isClick = true  // вхождение в папку
        }
        
        if (!this.pointerDownEventChecks(event)) {  // проверки на срабатывание DAD
            return
        }
        if (!this.getDADObject(event)) {  // Создание DADObject
            return
        }

        window.getSelection().removeAllRanges()  // disable all selection during DD
        
        this.enableSelected(this.DADObject.object)
        
        let stickyDADCoord = this.getStickyDADCoord(event.clientX, event.clientY) // координаты stickyDAD объекта {x, y}
        this.createDADIcon(stickyDADCoord.left, stickyDADCoord.top)  // создаем блок-подсказку, приклеенный к мыши

        this.leaveObjects.next = this.DADObject.object  // для работы снятия выделения в pointerMoveEvent

    },
    pointerDownEventChecks: function(event) {  // any checks for DAD start
        if (event.which != 1) {  // DAD работает только при нажатии левой кнопки мыши (или пальцем на экран телефона)
            if (document.body.contains(this.stickyDAD)) {  // удаляем существующие объекты при нажатии не левой кнопки
                this.disableSelected(this.DADObject.object)
                document.body.removeChild(this.stickyDAD)
                this.stickyDAD = undefined
            }
            return false
        }
    
        // DAD (нажатие мыши) не срабатывает на папку "вернуться"
        let isBackFolder = document.elementFromPoint(event.clientX, event.clientY).closest(`.${DADSettings.folderClass}.${classNames.backFolder}`)
        if (isBackFolder) {
            return false
        }
        // DAD (нажатие мыши) не срабатывает, если нажимать на область с настройками
        let isSettingField = document.elementFromPoint(event.clientX, event.clientY).closest(`.${classNames.settingIcon}`)
        if (isSettingField) {
            return false
        }
        return true
    },
    getDADObject: function(event) {  // getting DAD-object
        // Определяем, на каком объекте произошло нажатие. получаем объект dADObject
        let folderUnderCursorHTML = document.elementFromPoint(event.clientX, event.clientY).closest(`.${DADSettings.folderClass}`)
        let recordUnderCursorHTML = document.elementFromPoint(event.clientX, event.clientY).closest(`.${DADSettings.recordClass}`)
        if (folderUnderCursorHTML) {
            this.DADObject = {
                "typeObject": `${DADSettings.folderClass}`,
                "object": folderUnderCursorHTML,
                "text": 'any folder text'
                // "text": folderUnderCursorHTML.querySelector(`.folder-content > p`).innerText
            }
        } else if (recordUnderCursorHTML) {
            this.DADObject = {
                "typeObject": `${DADSettings.recordClass}`,
                "object": recordUnderCursorHTML,
                "text": 'any record text'
                // "text": recordUnderCursorHTML.querySelector(`.record-content > p`).innerText
            }
        } else { // никакой объект под мышкой не найден
            return false
        }
        return true
    },
    getStickyDADCoord: function(pointerX, pointerY) {  // getting coords for stickyObject
        // объект не должен визуально выходить за границы области

        // координаты DAD области
        let objectsList = document.getElementById('objectsList')
        let bounds = objectsList.getBoundingClientRect()
        let directMenuCoord = {
            "left_start": bounds.x,
            "left_end": bounds.x + bounds.width,
            "top_start": bounds.y,
            "top_end": bounds.y + bounds.height,
        }

        let stickyDADCoord = { // координаты закрепленного DAD объекта
            "left": pointerX,
            "top": pointerY
        }

        // смещение закрепленного объекта на границах DAD-area
        if (pointerX < directMenuCoord.left_start) {  // Оx
            stickyDADCoord.left = directMenuCoord.left_start
        } else if (pointerX > (directMenuCoord.left_end - stickyDADSettings.width)) {
            stickyDADCoord.left = directMenuCoord.left_end - stickyDADSettings.width
        } else {
            stickyDADCoord.left = pointerX
        }
        if (pointerY < directMenuCoord.top_start) {  // Oy
            stickyDADCoord.top = directMenuCoord.top_start
        } else if (pointerY > (directMenuCoord.top_end - stickyDADSettings.height)) {
            stickyDADCoord.top = directMenuCoord.top_end - stickyDADSettings.height
        } else {
            stickyDADCoord.top = pointerY
        }
        stickyDADCoord.top += window.pageYOffset  // смещение вниз при перемещении скролла
        return stickyDADCoord
    },
    createDADIcon: function(left, top) {  // create an object attached to the mouse
        if (this.stickyDAD !== null) {  // Если объект уже существует, то новый не создаем (защита от багов)
            return
        }
    
        this.stickyDAD = document.createElement("div") // создаем блок-подсказку, закрепленный за мышкой, вручную
        this.stickyDAD.className = classNames.stickyDAD
        this.stickyDAD.id = 'stickyDAD'
        this.stickyDAD.innerHTML = `
            <div class="dragging-object" id="dragging_object" style="width: ${stickyDADSettings.width}px; height: ${stickyDADSettings.height}px; border: solid rgb(0, 0, 0) 2px; border-radius: 5px;">
                <p style="margin-bottom: 0px">${this.DADObject.text}</p>
            </div>
        `
        this.stickyDAD.style.position = 'absolute'
        this.stickyDAD.style.zIndex = 1000
        this.stickyDAD.style['pointer-events'] = "none"  // запрещает объекту реагировать на мышь
        this.stickyDAD.style.left = left + "px"  // создаем объект под мышью
        this.stickyDAD.style.top = top + "px"
    
        let dragging_object = this.stickyDAD.children.item(0)
        dragging_object.style['background-color'] = 'antiquewhite'
        dragging_object.style['border-color'] = stickyDADSettings['border-color']
        dragging_object.style.opacity = stickyDADSettings.opacity
    
        // document.body.append(this.stickyDAD)

    },
    enableSelected(obj) {  // выделяем перетаскиваемый объект
        obj.style['background-color'] = 'grey'
    },
    disableSelected(obj) {  // снимаем выделение с объекта
        obj.style['background-color'] = null
    },
    disableRightButton: function(event) { // disable right btn during DD
        if (!(this.isClick || this.DADObject.object)) {
            return
        }
        event.preventDefault()
    },

    //////////////////////////////////////////////////////////////////////
    // Mouse MOVE events
    //////////////////////////////////////////////////////////////////////
    pointerMoveEvent: function(event) {  // main movement event
        
        if (this.stickyDAD !== null) {  // attach sticky object to mouse
            let stickyDADCoord = this.getStickyDADCoord(event.clientX, event.clientY) // координаты stickyDAD объекта {x, y}
            this.stickyDAD.style.left = stickyDADCoord.left + "px"
            this.stickyDAD.style.top = stickyDADCoord.top + "px"
            document.body.append(this.stickyDAD)
        }
        this.isClick = false // disable transition into the folder during DAD
        if (!this.DADObject.object) return  // Does DAD-object exist?
    
        // Находим элемент, над которым в данный момент находится курсор (папка или запись)
        let elementBelow = document.elementFromPoint(event.clientX, event.clientY).closest(`.${DADSettings.draggableClass}`)
    
        if (!this.checkDraggingElem(elementBelow)) return  // Does event correct?
    
        // определяем, в какой зоне (верх, середина, низ) над проносимымы объектом находится курсор
        let relativePosition = this.getRelativePosition(event, elementBelow)
    
        // если под нами папка "вернуться", то элемент нельзя переместить выше нее
        // если папка не будет перечисленная в общем списке, то зоны не имеют значения (будет только "переместить внутрь")
        let backFolder = document.getElementsByClassName('folder-back')[0]
        if ((elementBelow == backFolder) && ['top', 'middle'].includes(relativePosition)) {
            this.draggingPutInsideFolder(elementBelow)
            return
        }
        
        // мы перетаскиваем папку или запись (с зажатой ЛКМ)
        if (this.DADObject.object.classList.contains(DADSettings.folderClass)) {
            this.draggingFolder(event, elementBelow, relativePosition)
        } else if (this.DADObject.object.classList.contains(DADSettings.recordClass)) {
            this.draggingRecord(event, elementBelow, relativePosition)
        } else {
            console.log('The object under the cursor is not recognized as a folder or record')
        }
    },
    checkDraggingElem: function(elementBelow) { // check of correctness of the operation
        if (!elementBelow) {
            return false
        }
        let belowIsFolder = elementBelow.classList.contains(`${DADSettings.folderClass}`)
        let belowIsRecord = elementBelow.classList.contains(`${DADSettings.recordClass}`)
        if (this.DADObject !== elementBelow &&  // событие сработало не на том элементе, который мы перемещаем
            (belowIsFolder || belowIsRecord)) // событие сработало именно на элементе списка папок и записей
        { return true } else 
        { return false }
    },
    getRelativePosition: function(event, elementBelow) {  // searching for relative cursor position
        let elementCoord = elementBelow.getBoundingClientRect();
        let relativeY = event.clientY - elementCoord.y // координата Y относительно начала элемента (сверху вниз)
        let absoluteY = elementCoord.height // координата Y элемента (его высота)

        // Every element is divided into 3 zones: top, miggle, bottom
        if (relativeY <= DADSettings.putBeetwenArea) {
            return 'top'
        } else if (relativeY <= absoluteY - DADSettings.putBeetwenArea) {
            return 'middle'
        } else if (relativeY <= absoluteY) {
            return 'bottom'
        } else if (
            // произошло смещение элемента и координаты "прошлого" элемента изменились
            document.elementFromPoint(event.clientX, event.clientY).closest(`.${DADSettings.folderClass}`) &&
            elementBelow == document.elementFromPoint(event.clientX, event.clientY).closest(`.${DADSettings.folderClass}`).previousElementSibling
        ) {
            return false
        } else {
            console.log('Error of getRelativePosition()')
            return false
        }
    },
    draggingFolder: function(event, elementBelow, relativePosition) {  // dragging folder
        let belowIsFolder = elementBelow.classList.contains(DADSettings.folderClass)
        if (['middle'].includes(relativePosition) && belowIsFolder) {
            this.draggingPutInsideFolder(elementBelow, relativePosition)
        } else if (['top', 'bottom'].includes(relativePosition) && belowIsFolder) {
            if (!(this.DADObject.object === elementBelow)) {
                this.disableSelected(elementBelow)  // снятие выделения при перемещении из 2/4 и 3/4
            }
            this.draggingInsertElement(event, elementBelow, relativePosition)
        }
    },
    draggingRecord: function(event, elementBelow, relativePosition) {  // dragging record
        let belowIsFolder = elementBelow.classList.contains(DADSettings.folderClass)
        if (belowIsFolder) {
            this.draggingPutInsideFolder(elementBelow, relativePosition)
        } else {
            this.draggingInsertElement(event, elementBelow, relativePosition)
        }
    },
    draggingInsertElement: function(event, elementBelow, relativePosition) {  // inserting between
        
        // Находим элемент, с которым будем меняться местами
        let beforeElement = this.getBeforeElement(event.clientY, elementBelow)
    
        // Проверяем, нужно ли менять элементы местами
        if (
        beforeElement &&
        this.DADObject.object === beforeElement.previousElementSibling ||
        this.DADObject.object === beforeElement
        ) {
        // Если нет, выходим из функции, чтобы избежать лишних изменений в DOM
        // resetOptions(draggingVariables)
        return;
        }
    
        // Вставляем DADObject.object перед beforeElement
        if (!this.DADObject === elementBelow) {
            this.disableSelected(elementBelow)  // снятие выделения при перемещении из 2/4 и 3/4
        }
    
        // !!! вставка между
        elementBelow.parentNode.insertBefore(this.DADObject.object, beforeElement)
    
        // запомним элемент и четверть для окончания D&D
        this.draggingVariables.dragRelocate = elementBelow  // Элемент, над которым был курсор при перемещении объекта
        this.draggingVariables.dragRelocateQuarter = relativePosition  // четверть, над которым был курсор при перемещении объекта (1 или 4)
        this.draggingVariables.dragPutInside = null  // папка, в которую был помещен объект
    
    },
    draggingPutInsideFolder: function(elementBelow, relativePosition) {  // inserting inside the folder

        this.enableSelected(elementBelow)
    
        // !!! вставка внутрь
        // запоминаем папку
        this.draggingVariables.dragRelocate = null  // Элемент, над которым был курсор при перемещении объекта
        this.draggingVariables.dragRelocateQuarter = null  // четверть, над которым был курсор при перемещении объекта (1 или 4)
        this.draggingVariables.dragPutInside = elementBelow  // папка, в которую был помещен объект
    
    },
    getBeforeElement: function(cursorCoordY, elementBelow) {  // getting elem that will be shifted by reason of DAD
        // Находим элемент, с которым будем менять местами во время перетаскивания
    
        // Получаем координаты объекта под курсором
        let elementCoord = elementBelow.getBoundingClientRect()
    
        // Находим вертикальную координату центра текущего элемента (отсчитываем heigth вниз)
        let currentElementCenter = elementCoord.y + elementCoord.height / 2
    
        // выбираем beforeElement. Это будет либо элемент, над которым мы парим, либо следующий (ниже).
        // это необходимо, потому что мы можем вставить элемент только ПЕРЕД выбранным (функция insertBefore)
        let beforeElement = (cursorCoordY < currentElementCenter) ? // Если курсор выше центра элемента
            elementBelow :  // возвращаем текущий элемент
            elementBelow.nextElementSibling  // В ином случае — следующий DOM-элемент
    
        return beforeElement;
    },
    pointerMoveEventOut: function(event) {
        // событие перемещения объекта, которое должно сработать в любом случае после pointerMoveEvent
    
        if (!this.DADObject.object) return  // событие move может сработать где угодно. Нас интересуют только DAD события
    
        let elementBelow = document.elementFromPoint(event.clientX, event.clientY).closest(`.${DADSettings.draggableClass}`)
        if (this.leaveObjects.next != elementBelow) {
            this.leaveObjects.previous = this.leaveObjects.next
            this.leaveObjects.next = elementBelow
    
            if (this.leaveObjects.previous != this.DADObject.object && this.leaveObjects.previous) {
                this.disableSelected(this.leaveObjects.previous)
            }
        }
    
        // if (!elementBelow) {
        //     resetOptions(draggingVariables)  // инфа о соверешнном действии
        // }
        return
    
    },
    
    //////////////////////////////////////////////////////////////////////
    // Mouse RELEASE events
    //////////////////////////////////////////////////////////////////////
    pointerUpEvent: function(event) {  // main pointer up event

        if (!this.DADObject.object) {  // если перемещаемый объект не существует
            return
        }
        if (!this.stickyDAD) {  // если перемещаемый объект не существует
            return
        }
    
        let elementBelow = (event.target.closest(`.${DADSettings.folderClass}`)) ?
            event.target.closest(`.${DADSettings.folderClass}`):
            event.target.closest(`.${DADSettings.recordClass}`)
        this.disableSelected(this.DADObject.object)
        if (elementBelow) {
            this.disableSelected( elementBelow)
        }
    
        if (!this.isClick) {
            if (this.draggingVariables.dragPutInside) {
                this.putInsideFolder()
            } else if (this.draggingVariables.dragRelocate) {
                this.changeOrder()
            } else {
                console.log("Changes does't exist")
            }
        }
        
        this.removeDADMemory()
    
    },
    removeDADMemory: function() {  // clear information about the completed DAD
        
        if (this.leaveObjects.next) {
            this.disableSelected(this.leaveObjects.next)  // снимаем выделения с объектов
        }
    
        // сбрасываем значения переменных
        this.resetOptions(this.draggingVariables)  // инфа о соверешнном действии
        this.resetOptions(this.DADObject)  // инфа о перемещенном объекте действии
        this.resetOptions(this.leaveObjects)  // инфа о последнем объекте, который пересекала мышь
    
        if (document.body.contains(this.stickyDAD)) {  // разрушаем закрепленный DAD-объект - подсказку под мышью/курсором
            document.body.removeChild(this.stickyDAD)
            this.stickyDAD = null
        }
        if (this.stickyDAD != null) {  // объект создается (pointerdown) и отображается (poitermove) отдельно
            this.stickyDAD = null
        }
    
    },
    resetOptions: function(variable) {  // reset properties for next DAD
        for (let key in variable) {
            variable[key] = null
        }
    },

    //////////////////////////////////////////////////////////////////////
    // Симуляция функций для обработки данных
    //////////////////////////////////////////////////////////////////////
    changeOrder: function() {  // put any object between another objects
        console.log('Поместить рядом (Заглушка)')
    //     this.changedInterval = this.getChangedInterval()
    //     if (changedInterval.newOrder == changedInterval.oldOrder) {
    //         console.log("Object wasn't moved")
    //         return
    //     }
    //     console.log('Поместил рядом с', draggingVariables.dragRelocate)
    
    //     // change order by every record/folder
    //     if (DADObject.typeObject == 'record') {
    //         let movableRecord = folder_dict[current_folder_id].records.splice(changedInterval.oldOrder-1, 1)[0]
    //         folder_dict[current_folder_id].records.splice(changedInterval.newOrder-1, 0, movableRecord)
    //         let changedRecordOrders = []
    //         let min = Math.min(changedInterval.oldOrder, changedInterval.newOrder)
    //         let max = Math.max(changedInterval.oldOrder, changedInterval.newOrder)
    //         for (let i=min-1; i<=max-1; i++) {
    //             record_dict[folder_dict[current_folder_id].records[i]].order_id = i+1
    //             changedRecordOrders.push([
    //                 folder_dict[current_folder_id].records[i], 
    //                 record_dict[folder_dict[current_folder_id].records[i]].order_id
    //             ])
    //         }
    //         changeRecordsOrders(changedRecordOrders)
    //     } else if (DADObject.typeObject == 'folder') {
    //         let movableFolder = folder_dict[current_folder_id].folders.splice(changedInterval.oldOrder-1, 1)[0]
    //         folder_dict[current_folder_id].folders.splice(changedInterval.newOrder-1, 0, movableFolder)
    //         let changedRecordOrders = []
    //         let min = Math.min(changedInterval.oldOrder, changedInterval.newOrder)
    //         let max = Math.max(changedInterval.oldOrder, changedInterval.newOrder)
    //         for (let i=min-1; i<=max-1; i++) {
    //             folder_dict[folder_dict[current_folder_id].folders[i]].info.order_id = i+1
    //             changedRecordOrders.push([
    //                 folder_dict[current_folder_id].folders[i], 
    //                 folder_dict[folder_dict[current_folder_id].folders[i]].info.order_id
    //             ])
    //         }
    //         changeFoldersOrders(changedRecordOrders)
    //     } else {
    //         console.log('Error: incorrect type of DADObject.typeObject')
    //     }
    //     display_items(folder_dict[current_folder_id].folders, folder_dict[current_folder_id].records)
    },
    // getChangedInterval: function() {  // getting new and old order id
    //     let changedObjects = {
    //         'type': this.DADObject.typeObject, // folder of record
    //         'objectList': null, // list of html objects
    //         'objDict': null, // dictionary of folder/record DB objects
    //     }
    //     let changedInterval = {
    //         'newOrder': null,
    //         'oldOrder': null,
    //     }
    
    //     // if (session.section === 'notes') {
    //     //     if (this.DADObject.typeObject == `${DADSettings.folderClass}`) {
    //     //         changedObjects.objectList = document.getElementsByClassName(DADSettings.folderClass)
    //     //         // changedObjects.objectList = html_folders.children
    //     //         changedObjects.objDict = this.content.noteFolders
    //     //     } else {
    //     //         changedObjects.objectList = document.getElementsByClassName(DADSettings.recordClass)
    //     //         // changedObjects.objectList = html_records.children
    //     //         changedObjects.objDict = this.content.record
    //     //     }
    //     // } else {
    //     //     if (this.DADObject.typeObject == `${DADSettings.folderClass}`) {
    //     //         changedObjects.objectList = document.getElementsByClassName(DADSettings.folderClass)
    //     //         // changedObjects.objectList = html_folders.children
    //     //         changedObjects.objDict = this.content.folderDict
    //     //     } else {
    //     //         changedObjects.objectList = document.getElementsByClassName(DADSettings.recordClass)
    //     //         // changedObjects.objectList = html_records.children
    //     //         changedObjects.objDict = this.content.record
    //     //         changedObjects.objDict = record_dict
    //     //     }
    //     // }
    //     if (this.DADObject.typeObject == `${DADSettings.folderClass}`) {
    //         changedObjects.objectList = document.getElementsByClassName(DADSettings.folderClass)
    //         // changedObjects.objectList = html_folders.children
    //         changedObjects.objDict = document.getElementsByClassName(DADSettings.recordClass)
    //     } else {
    //         changedObjects.objectList = document.getElementsByClassName(DADSettings.recordClass)
    //         // changedObjects.objectList = html_records.children
    //         changedObjects.objDict = this.content.record
    //         changedObjects.objDict = record_dict
    //     }
        
    
    //     // finding new order of dragable object
    //     for (let i=0; i<changedObjects.objectList.length; i++) {
    //         if (changedObjects.objectList[i].dataset.ddobjectid == DADObject.object.dataset.ddobjectid) {
    //             // changedObjects.objectID = DADObject.object.dataset.ddobjectid
    //             changedInterval.oldOrder = changedObjects.type == 'folder'?
    //                 changedObjects.objDict[DADObject.object.dataset.ddobjectid].info.order_id:
    //                 changedObjects.objDict[DADObject.object.dataset.ddobjectid].order_id
    //             changedInterval.newOrder = i+1
    //             break
    //         }
    //     }
    //     // console.log(`
    //     //     finded! ID=${DADObject.object.dataset.ddobjectid}, 
    //     //     oldOrderID=${changedInterval.oldOrder}, 
    //     //     newOrderID=${changedInterval.newOrder}
    //     // `)
    //     return changedInterval
    // },
    putInsideFolder: function() {
        // put object (record or folder) in folder
        console.log('Поместить внутрь папки (Заглушка)')
    
        // console.log('putInsideFolder')
    
        // let currentDADObjectID = DADObject.object.dataset.ddobjectid
        
        // let elementBelow = document.elementFromPoint(event.clientX, event.clientY).closest(`.${DADSettings.draggableClass}`)
        // if (!elementBelow) {
        //     return
        // }
        // if (!elementBelow.classList.contains(DADSettings.folderClass)) {
        //     return
        // }
        // if (!(draggingVariables.dragPutInside && DADObject.object && folder_dict[current_folder_id])) {
        //     return
        // }
        // if (DADObject.typeObject == DADSettings.folderClass &&
        //     DADObject.object.dataset.ddobjectid == draggingVariables.dragPutInside.dataset.ddobjectid) {
        //     return // Folder can't relocate inside itself
        // }
    
        // console.log('Поместил в ', draggingVariables.dragPutInside)
    
        // let inletFolderID = parseInt(draggingVariables.dragPutInside.dataset.ddobjectid)
        // let outletFolderID = current_folder_id
        // let currentOrder = null
    
        // // change DAD-object
        // if (DADObject.typeObject == 'record') {
        //     let record_id = DADObject.object.dataset.ddobjectid
        //     currentOrder = record_dict[record_id].order_id
        //     folder_dict[inletFolderID].records.push(record_id)
        //     folder_dict[outletFolderID].records.splice(record_dict[record_id].order_id-1, 1)
        //     record_dict[record_id].parent_id = inletFolderID
        //     record_dict[record_id].order_id = folder_dict[inletFolderID].records.length
        //     changeRecordRequest(
        //         record_id, 
        //         (record_dict[record_id].parent_id, record_dict[record_id].order_id)
        //     )
        // } else if (DADObject.typeObject == 'folder') {
        //     let folder_id = DADObject.object.dataset.ddobjectid
        //     currentOrder = folder_dict[folder_id].info.order_id
        //     folder_dict[inletFolderID].folders.push(folder_id)
        //     folder_dict[outletFolderID].folders.splice(folder_dict[folder_id].info.order_id-1, 1)
        //     folder_dict[folder_id].info.parent_id = inletFolderID
        //     folder_dict[folder_id].info.order_id = folder_dict[inletFolderID].folders.length
        //     changeFolderRequest(
        //         folder_id, 
        //         (folder_dict[folder_id].parent_id, folder_dict[folder_id].order_id)
        //     )
        // } else {
        //     console.log('Error: incorrect type of DADObject.typeObject')
        //     return
        // }
    
        // // change orders
        // if (DADObject.typeObject == 'record') {
        //     let changedRecordOrders = []
        //     for (let i=currentOrder-1; i<folder_dict[current_folder_id].records.length; i++) {
        //         record_dict[folder_dict[current_folder_id].records[i]].order_id -= 1
        //         changedRecordOrders.push([
        //             folder_dict[current_folder_id].records[i], 
        //             record_dict[folder_dict[current_folder_id].records[i]].order_id
        //         ])
        //     }
        //     changeRecordsOrders(changedRecordOrders)
        // } else if (DADObject.typeObject == 'folder') {
        //     let changedRecordOrders = []
        //     for (let i=currentOrder-1; i<folder_dict[current_folder_id].folders.length; i++) {
        //         folder_dict[folder_dict[current_folder_id].folders[i]].info.order_id -= 1
        //         changedRecordOrders.push([
        //             folder_dict[current_folder_id].folders[i], 
        //             folder_dict[folder_dict[current_folder_id].folders[i]].info.order_id
        //         ])
        //     }
        //     changeFoldersOrders(changedRecordOrders)
        // } else {
        //     console.log('Error: incorrect type of DADObject.typeObject')
        //     return
        // }
        // display_items(folder_dict[current_folder_id].folders, folder_dict[current_folder_id].records)
    },
    
    

    run: function() {
        // Drag And Drop (DAD) events
        let objectsList = document.getElementById('objectsList')
        objectsList.addEventListener(`pointerdown`, this.pointerDownEvent.bind(this));
        document.addEventListener(`contextmenu`, this.disableRightButton.bind(this)); // disable right btn during DD
        // document.addEventListener(`pointerup`, change4th5thBTN);
        document.addEventListener(`pointermove`, this.pointerMoveEvent.bind(this));  // document, чтобы DADObject скользил вдоль границы DADArea, когда курсор ее покидает  
        document.addEventListener(`pointermove`, this.pointerMoveEventOut.bind(this));  // document, чтобы снятие выделение предыдущего объекта работало корректно
        document.addEventListener(`pointerup`, this.pointerUpEvent.bind(this));
        // directMenu.addEventListener(`click`, openObject);
    }
}
DragAndDrop.run()
