module Mutations
  class CreateBookmark < BaseMutation
    argument :title, String, required: true
    argument :url, String, required: true

    field :bookmark, Types::BookmarkType, null: true
    field :errors, [ String ], null: false

    def resolve(title:, url:)
      bookmark = Bookmark.new(title: title, url: url)
      if bookmark.save
        { bookmark: bookmark, errors: [] }
      else
        { bookmark: nil, errors: bookmark.errors.full_messages }
      end
    end
  end
end
