module Mutations
  class DeleteBookmark < BaseMutation
    argument :id, ID, required: true

    field :success, Boolean, null: false
    field :errors, [ String ], null: false

    def resolve(id:)
      bookmark = Bookmark.find_by(id: id)
      if bookmark&.destroy
        { success: true, errors: [] }
      else
        { success: false, errors: [ "Bookmark not found" ] }
      end
    end
  end
end
