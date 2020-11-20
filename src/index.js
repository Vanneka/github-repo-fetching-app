// require the dotenv
import dotenv from 'dotenv';
dotenv.config()
// the CSS
import './styles/style.css';

// ENV VARIABLE
// const api_key = process.env.NODE_ENV_TOKEN;
// console.log(api_key)

// VARIABLES
let menuBtn = document.querySelector('#menu-toggle');
// EVENT LISTENERS
menuBtn.addEventListener('click', toggleMenu);

// FUNCTIONS
function toggleMenu(){
    let mobileMenu = document.querySelector('#mobile-nav-items');

    mobileMenu.classList.toggle('show');
    mobileMenu.classList.toggle('hide');
}

/* GRAPHQL STARTS HERE */
const token = process.env.NODE_ENV_TOKEN;

const baseUrl = "https://api.github.com/graphql"
const body = {
    "query": `{
        user(login: "Vanneka") {
          avatarUrl(size: 220)
          bio
          email
          followers {
            totalCount
          }
          following {
            totalCount
          }
          location
          name
          login
          url
          twitterUsername
          repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
            edges {
              node {
                id
                name
                description
                url
                languages(first: 1) {
                  nodes {
                    color
                    name
                  }
                }
                isFork
                updatedAt
                forkCount
              }
            }
          }
        }
      }
      `
}

const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
}

fetch(baseUrl, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
})
.then((res)=>{
    return res.json()
})
.then((data)=>{
    // result section
    let profileSection = document.getElementById('github-profile-info');
    let repoList = document.getElementById('repo-listing');


    const fetchedData = data.data.user;
    let userDetails = {
        avatar: fetchedData.avatarUrl,
        bio: fetchedData.bio,
        email: fetchedData.email,
        followersCount: fetchedData.followers.totalCount,
        followingCount: fetchedData.following.totalCount,
        address: fetchedData.location,
        username: fetchedData.login,
        repoList: fetchedData.repositories.edges,
        twitterName: fetchedData.twitterUsername,
        url: fetchedData.url
    }
    
    profileSection.innerHTML += `
    <section id="github-profile-info">
            <div class="profile-info p-y-1">
                <img src="${userDetails.avatar}" alt="">
                <button class="desktop-status-btn">
                    <i class="fa fa-smile-o "></i>
                </button>
                <div class="user-profile-text">
                    <h2 class="name">
                        Vanessa Okeke
                    </h2>
                    <p class="nickname p-y-1">
                        ${userDetails.username}
                    </p>
                </div>
            </div>

            <div class="user-status m-y-3">
                <button class="btn mobile-status-btn" id="status-btn">
                    <i class="fa fa-smile-o "></i> Set status
                </button>
            </div>

            <div class="user-info-bio">
                <p class="bio">
                ${userDetails.bio}
                </p>

                <button class="btn m-y-1" id="edit-profile">
                    Edit profile
                </button>

                <div class="user-social-info">
                    <ul class="user-follow-count">
                        <li><a href=""><i class="fa fa-user-o  icon-pr"></i><span class="number-count">6</span>
                                followers</a></li>
                        <li><a href=""><i class="fa fa-dot-circle-o icon-pr"></i><span class="number-count">${userDetails.followingCount}</span>
                                following</a></li>
                        <li><a href=""><i class="fa fa-star-o icon-pr"></i><span class="number-count">${userDetails.followersCount}</span></a></li>
                    </ul>

                    <ul class="user-social-details">
                        <li id="address"><i class="fa fa-map-marker icon-pr"></i><a href=""><span class="social-item">${userDetails.address}</span></a>
                        </li>
                        <li id="email"><i class="fa fa-envelope-o icon-pr"></i><a href="mailto:${userDetails.email}"><span
                                    class="social-item">${userDetails.email}</span></a>
                        </li>
                        <li id="website"><i class="fa fa-link icon-pr"></i><a href="${userDetails.url}" target="_blank"><span
                                    class="social-item">${userDetails.url}</span></a></li>
                    </ul>
                </div>

                <div class="highlights">
                    <h2 class="highllight-title"></h2>
                    <p class="highlight-type">
                        <i class="fa fa-facebook"></i> Arctic Code Vault Contributor
                    </p>
                </div>
            </div>
            
        </section>
    `


let items = userDetails.repoList

//run it as a function then put the function inside the div of the repos
function showRepos(datas){
    
    let count = 0;
    datas.forEach(data => {
        let parentNode = data.node;
        // let repoLangCol = document.getElementById('repo-color');
        repoList.innerHTML += `
        <article class="repo-item p-y-3">
                    <div class="left-section">
                        <div class="left-section-text">
                            <p class="repo-title">
                                <a href="${parentNode.url}">${parentNode.name}</a>
                            </p>
                            <p class="repo-desc">
                            ${parentNode.description}
                            </p>
                        </div>

                        <ul class="repo-info">
                            <li class="repo-lang">
                                <div id="repo-color" style="background:${data.node.languages.nodes[0].color};">
                                </div> ${data.node.languages.nodes[0].name}
                            </li>
                            <li class="repo-forked">
                            <i class="fa 
                            fa-code-fork"></i> 8</li>
                            <li class="repo-update-time">Updated <span class="update-time">${handleDate(parentNode.updatedAt)}</span></li>
                        </ul>
                    </div>

                    <div class="right-section">
                        <button class="btn" id="add-star">
                            <i class="fa fa-star-o"></i> star
                        </button>
                    </div>
                </article> `
                count++
    });
 

    function handleDate(dateItem){
        let dateThing = new Date(`${dateItem}`);

        let day= dateThing.getDate();
        let month= dateThing.toLocaleString('en-us', {month: 'short'});
        let year= dateThing.getFullYear();

        return (`${day} ${month} ${year}`);
    }
}

showRepos(items)
})
.catch(err=>{
    console.log(err)
})


// FUNCTION FOR SUB-MENU
let subMenuBtn = document.getElementById('plus-icon-menu')

//event listener
subMenuBtn.addEventListener('click', showMenu)

function showMenu(){
    let menuBar = document.querySelector('.main-sub-menu');

    menuBar.classList.toggle('visible');
    menuBar.classList.toggle('not-visible');
}