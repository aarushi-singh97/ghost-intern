import { ChevronDown, ChevronRight, FileCode2, Folder, FolderOpen } from 'lucide-react'
import { useMemo, useState } from 'react'

function DirectoryTree({ folders, files }) {
  const [openFolders, setOpenFolders] = useState([])
  const rootFolders = useMemo(
    () => [...new Set(folders.map((folder) => folder.path.split('/')[0]))].slice(0, 30),
    [folders]
  )

  function toggleFolder(path) {
    setOpenFolders((current) =>
      current.includes(path) ? current.filter((folder) => folder !== path) : [...current, path]
    )
  }

  if (!rootFolders.length) {
    return <p className="empty-note">Analyze a repository to load its directory structure.</p>
  }

  return (
    <div className="directory-tree">
      {rootFolders.map((rootPath) => {
        const isOpen = openFolders.includes(rootPath)
        const childFolders = isOpen
          ? folders.filter((folder) => {
              const remainder = folder.path.slice(rootPath.length + 1)
              return folder.path.startsWith(`${rootPath}/`) && remainder && !remainder.includes('/')
            })
          : []
        const childFiles = isOpen
          ? files.filter((file) => {
              const remainder = file.path.slice(rootPath.length + 1)
              return file.path.startsWith(`${rootPath}/`) && remainder && !remainder.includes('/')
            })
          : []
        const children = [...childFolders, ...childFiles].slice(0, 40)

        return (
          <div className="tree-group" key={rootPath}>
            <button type="button" className="tree-folder" onClick={() => toggleFolder(rootPath)}>
              {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              {isOpen ? <FolderOpen size={20} /> : <Folder size={20} />}
              <span>{rootPath}</span>
            </button>
            {isOpen ? (
              <div className="tree-children">
                {children.length ? (
                  children.map((item) => (
                    <div className="tree-item" key={item.path}>
                      {item.type === 'folder' ? <Folder size={18} /> : <FileCode2 size={18} />}
                      <span>{item.path.split('/').pop()}</span>
                    </div>
                  ))
                ) : (
                  <span className="empty-note">No direct children found.</span>
                )}
                {childFolders.length + childFiles.length > 40 ? (
                  <span className="empty-note">Showing the first 40 items.</span>
                ) : null}
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export default DirectoryTree
