module Mutations
  class UpdateBookmark < BaseMutation
    argument :id, ID, required: true
    argument :title, String, required: false
    argument :url, String, required: false

    field :bookmark, Types::BookmarkType, null: true
    field :errors, [String], null: false

    def resolve(id:, title: nil, url: nil)
      bookmark = Bookmark.find_by(id: id)
      return { bookmark: nil, errors: ["Закладка не найдена"] } unless bookmark

      if bookmark.update(title: title, url: url)
        { bookmark: bookmark, errors: [] }
      else
        { bookmark: nil, errors: bookmark.errors.full_messages }
      end
    end
  end
end
