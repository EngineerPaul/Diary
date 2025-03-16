let ContentSettings = {
    section: sessionStorage.getItem('section')?
             sessionStorage.getItem('section'):
             'notes',
    urls: {
        getNotes: 'drf/get-content/getNotes',
        getNoteFolders: 'drf/get-content/getNoteFolders',
        getNotices: 'drf/get-content/getNotices',
        getNoticeFolders: 'drf/get-content/getNoticeFolders',
    },
    token: '',  // authorization
    
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

let contentTest = {
    type: null, // notes or notices
    folders: null,
    notes: null,
    notices: null,

    getFolderList: function() {
        let noteFolderList = [ // заглушка для теста
            {
                id: 'f1',
                title: "note-folder 1",
                labels: "labelsF 1",
                color: 'yellow'
            },
            {
                id: 'f2',
                title: "note-folder 2",
                labels: "labelsF 2",
                color: 'green'
            }
        ]
        this.folders = noteFolderList
        return noteFolderList
    },
    getNotes: function() {
        let noteContentList = [ // заглушка для теста
            {
                id: 'n1',
                title: "note-block 1",
                labels: "labels 1",
                color: 'yellow'
            },
            {
                id: 'n2',
                title: "note-block 2",
                labels: "labels 2",
                color: 'red'
            },
            {
                id: 'n3',
                title: "note-block 3",
                labels: "labels 3",
                color: 'green'
            }
        ]
        this.notes = noteContentList
        return noteContentList
    },
    getNoties: function() {
        let notiesList = [ // заглушка для теста

        ]
        this.noties = notiesList
        return notiesList
    },
    viewObjects: function() {
        let type = ContentSettings.section
        let folderLst = this.folders
        let entities = this[type]

        if (entities === null) { // delete when notices works 
            console.log('notices doest work')
            return
        }

        for (let i=0; i<folderLst.length; i++) {
            this.createFolder(
                folderLst[i].id, folderLst[i].title, 
                folderLst[i].labels, folderLst[i].color
            )
        }
    
        for (let i=0; i<entities.length; i++) {
            if (type=="notes") {
                this.createNote(
                    id=entities[i].id,
                    title=entities[i].title, 
                    labelsLst=entities[i].labels,
                    color=entities[i].color,
                    objtype='note'
                )
            } else if (type=="notices") {
                this.createNotice(
                    id=entities[i].id,
                    title=entities[i].title, 
                    labelsLst=entities[i].labels,
                    color=entities[i].color,
                    objtype='notices',
                    datetime=entities[i].datetime
                )
            } else alert('viewObjects wrong!')
        }
    },
    createNote: function(id, title, labelsLst, color, objtype, datetime) {
        let noteBlock = document.createElement("div")
        let blockRow = document.createElement("div")
        let coll1 = document.createElement("div")
            let marker = document.createElement("div")
            // svg
        let coll2 = document.createElement("div")
            if (objtype==='noties') {
                let datetime = document.createElement("div")
                let datetimeP = document.createElement("div")
                let space = document.createElement("span")
            }
            let titleBlock = document.createElement("div")
                let titleP = document.createElement("p")
        let coll3 = document.createElement("div")
            let labels = document.createElement("div")
            // svg

        noteBlock.className = "dd-object"
        noteBlock.id = id
        blockRow.className = 'block-row'
        coll1.className = 'coll1'
        coll2.className = 'coll2'
        coll3.className = 'coll3'
        marker.className = 'marker'
        marker.dataset['color'] = color
        if (objtype==='noties') {
            datetime.className = 'datetime'
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
        if (objtype==='noties') {
            coll2.append(datetime)
            datetime.append(datetimeP)
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
    createNotice: function(id, title, labels, color, datetime) {
        console.log("createNotice")
    },
    createFolder: function(id, title, labels, color, datetime) {
        console.log("createFolder, id=", id)
    },
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
    removeObjects: function() {
        objectsList.innerHTML = ''
    },
    run: function() {
        this.getNotes()
        this.getFolderList()
        this.getNoties()
        this.viewObjects(ContentSettings.section)
    }
}
contentTest.run()

let Header = {
    sections: document.getElementById('sections'),

    headerClick: function(event) {
        let sec = event.target.closest('.header-field')
        if (!sec) return

        section = event.target.closest('.header-field').id
        sessionStorage.setItem('section', section)
        ContentSettings.section = section

        this.toggleHeaderField()
        contentTest.removeObjects()
        contentTest.viewObjects(section)
    },
    toggleHeaderField: function() {
        let section = document.getElementById(ContentSettings.section)
        let sectionSecond = ContentSettings.section==='notes'?
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

    Note: function(record_id, note_name, order_id, color, parent_id) {
        // create note object using new notation
        this.record_id = record_id  // name like notice
        this.title = note_name
        this.order_id = order_id
        this.color = color
        this.parent_id = parent_id  // folder id
    },
    Notice: function(record_id, notice_name, order_id, color, parent_id, date) {
        // create notice object using new notation
        this.record_id = record_id  // name like note
        this.title = notice_name
        this.order_id = order_id
        this.color = color
        this.parent_id = parent_id  // folder id
        this.date = date
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
        let notices = []
        let noticeFolders = []
        
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
            console.log('Content Error: Url doesn exists!')
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

        let noticesList = this.getListOfObjects(ContentSettings.urls.getNotes, this.Note)
        let noticeFoldersList = this.getListOfObjects(ContentSettings.urls.getNoteFolders, this.Folder)
        let noticesDict = this.getDictOfRecords(noticesList)
        let noticeFoldersDict = this.getDictOfFolders(noticeFoldersList)
        let noticeFoldersDictFilled = this.fillOutFolderDict(noticeFoldersDict, noticesList)
        
        this.notes = notesDict
        this.noteFolders = noteFoldersDictFilled
        this.notices = noticesDict
        this.noticeFolders = noticeFoldersDictFilled
    },

    run: function() {
        this.getContent()
    }
}
content.run()

let viewContent = {
    
}

let DragAndDrop = {
    
}
