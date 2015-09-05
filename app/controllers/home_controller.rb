class HomeController < ApplicationController
  def index
    @medias = @medias_old = []
    title = params[:title].blank? ? '日の出' : params[:title][:value]
    session[:title] = title
    @medias = Instagram.tag_recent_media(URI.encode(title),{:count => 30})
    @medias_old=[]
    session[:max_id]=@medias.pagination.next_max_id

    render
#    @medias = Kaminari.paginate_array(medias).page(params[:page] ? params[:page] : nil).per(15)
  end
  
  def next_page
    @medias = @medias_old = []
    @medias_old = Instagram.tag_recent_media(URI.encode(params[:title]),{:count => 30,:max_id=>session[:max_id]})
    session[:max_id_tmp] = session[:max_id]
    session[:max_id]=@medias_old.pagination.next_max_id

    render
  end

end